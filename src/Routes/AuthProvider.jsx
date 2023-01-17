import { useToast } from "@chakra-ui/react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { arrayUnion, collection, doc, getDoc, limit, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, fetchToken } from "../Config/firebase";
import AuthContext from "./hooks/AuthContext";
import store from 'store'
import { getNew, postImportirAuth } from '../Api/importirApi'
import _axios from "../Api/AxiosBarrier";
import { get } from '../Api/importirApi';

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState('');
    const [tokenId, setTokenId] = useState("");
    const [loading, setLoading] = useState(false);
    const [userStorage, setUserStorage] = useState()
    const [userDb, setUserDb] = useState()
    const [cart, setCart] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [productListWishlist, setProductWishlist] = useState([])

    const [activeCategory, setActiveCategory] = useState('')
	const [productList, setProductList] = useState('')
    const [search, setSearch] = useState('')

    const [productData, setProductdata] = useState([])

    const navigate = useNavigate();
    const toast = useToast();

    const login = (email, password) => {
        loadingShow()
        return signInWithEmailAndPassword(auth, email, password)
            .then(async (response) => {
                const user = response.user
                if (user) {
                    let userData = {}
                    const result = await postImportirAuth(
                        { email: email },
                        'sign-in'
                    )
                    if (result.status === true) {
                        userData.email = email
                        userData.token = result.data
                        userData.status = true
                        // const data = JSON.stringify(userData)
                        setUserStorage(userData)
                        await store.set('userData', userData)
                    }
                }
                try {
                    const docRef = doc(db, "users", response.user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        await updateDoc(docRef, { tokenId: arrayUnion(tokenId) });
                        // console.log('test')
                    } else {
                        console.log("No such document!");
                    }
                    getCart()
                    loadingClose()
                } catch (error) {
                    console.log(error, "ini error");
                    loadingClose()
                }

                toast({
                    title: "Success Login",
                    description: `Success Login account ${response.user.displayName} `,
                    status: "success",
                    duration: 10000,
                    isClosable: true,
                    position: "top-right",
                });



                return navigate("/");
            })
            .catch((error) => {
                toast({
                    title: "Something wrong !",
                    description: error.message,
                    status: "error",
                    duration: 10000,
                    isClosable: true,
                    position: "top-right",
                });
                loadingClose()
            });
    };

    const signOut = () => {
        return auth.signOut();
    };

    const getUserDataDb = () => {
        if (currentUser !== "") {
            try {
                onSnapshot(doc(db, "users", currentUser?.uid), (doc) => {
                    setUserDb(doc.data());
                });
            } catch (error) {
                console.log(error, 'error')
            }
        }
    }



    //onsnapshot product
    // const getProductBisnis = async () => {
    //     try {
    //         const q = query(collection(db, "course"), orderBy("nama"), limit(10));
    //         onSnapshot(q, (querySnapshot) => {
    //             const arr = [];
    //             querySnapshot.forEach((doc) => {
    //                 const objData = doc.data()
    //                 objData.id = doc.id
    //                 arr.push(objData)
    //             });
    //             setProducts(arr)
    //         });
    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // };

    //onsnapshot product
    // const getProductName = async (name) => {
    //     try {
    //         try {
    //             onSnapshot(doc(db, "course", name), (doc) => {
    //                 setProductList(doc.data());
    //             });

    //         } catch (error) {
    //             console.log(error.message)
    //         }
    //     } catch (error) {
    //         console.log(error.message)
    //     }
    //     return productList
    // };

    const getUserStorage = async () => {
        if (currentUser !== "") {
            try {
                const res = await store.get("userData");
                setUserStorage(res)

            } catch (error) {
                console.log(error, 'error')
            }
        }
    };

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const getUser = () => {
        return auth.currentUser;
    };

    // get data cart

    const getCart = async () => {
        let sum = 0
        try {
            const res = await _axios('api/blj-cart/index')
            if (res) {
                setCart(res)
                const dataArr = res.data
                dataArr.forEach(item => {
                    sum += (parseInt(item.price))
                    setTotalPrice(sum)
                }
                )

                const ref = doc(db, "carts", currentUser.uid);
                await setDoc(ref, {
                    data: res.data,
                    lastUpdated: new Date(),
                    totalPrice: sum
                }, { merge: true });


            }

        } catch (error) {
            console.log(error.message, 'in getcart')
        }
    }

    const loadingShow = () => {
        setLoading(true)
    }

    const loadingClose = () => {
        setLoading(false)
    }
    // get data wishlist

    const getDataWishlist = () => {
        try {
            onSnapshot(doc(db, "wishlist", currentUser.uid), (doc) => {
                console.log(doc.data(), 'ini data');
                setProductWishlist(doc.data());
            });

        } catch (error) {
            console.log(error.message)
        }

    }

    // get Data Product Page

    	const getDataProduct = async (count) => {
		loadingShow()
		console.log(count, 'count')
		let productArr = []
		try {
			const result = await getNew('blj-product-video', 'list-product', `page=${count}`)
			if (result) {

				const dataArr = result.data.data
				productArr.push(...dataArr)
			}
			if (count > 1) {
				setProductList([...productList, ...productArr])
			} else {
				setProductList(productArr)
			}
			loadingClose()
		} catch (error) {
			console.log(error.message, 'error in shop screen')
			loadingClose()
		}
		loadingClose()
	}

	const getProductList = async (id, name) => {
		setActiveCategory(name)
		setProductList([])
		loadingShow()
		try {
			const result = await getNew('blj-product-video/list-product-by-category', id)
			if (result) {
				setProductList(result?.data?.data)

			}
			  loadingClose()
		} catch (error) {
			console.log(error.message, 'error in shop screen')
			  loadingClose()
		}
	}

	const handleKeyDown = async (event) => {
		setSearch(event.target.value)
		if (event.key === "Enter") {
			setProductList([])
			loadingShow()
			try {
				const result = await getNew('blj-product-video', 'list-product', `search=${search}`)

				if (result) {
					// console.log(result.data.data,'total data')
					setProductList(result.data.data)
				}
				  loadingClose()
			} catch (error) {
				console.log(error.message, 'error in shop screen')
				  loadingClose()
			}
		}
	};

   // Home Page

   const getData = async (count) => {
    loadingShow()
    let productArr = []
    try {
        const res = await getNew('blj-product-video', 'list', `page=${count}`)
        if (res) {
            const dataArr = res.data
            productArr.push(...dataArr)
        }
        if (count > 1) {
            setProductdata([...productData, ...productArr])
        } else {
            setProductdata(productArr)
        }
        loadingClose()
    } catch (error) {
        console.log(error, 'ini error')
        loadingClose()
    }
}



    



    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            fetchToken(setTokenId)
            // getProductBisnis()
        });
    }, []);


    useEffect(() => {
        getUserDataDb()
        getUserStorage()

        return () => {
        }
    }, [currentUser])


    useEffect(() => {
        getCart()
        getDataWishlist()

        return () => {
            setCart([])
            setTotalPrice(0)
        }
    }, [currentUser])

    useEffect(() => {
        getData()
        getDataProduct()
    
      return () => {
        setProductdata([])
        setProductList([])
      }
    }, [])
    



    const value = {
        currentUser,
        tokenId,
        getUser,
        login,
        signOut,
        signUp,
        getUserStorage,
        userStorage,
        userDb,
        cart,
        totalPrice,
        getCart,
        productListWishlist,
        loadingShow,
        loadingClose,
        loading,

        activeCategory,
        productList,
        setSearch,
        handleKeyDown,
        getProductList,
        setActiveCategory,
        getDataProduct,

        getData,
        productData

    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
