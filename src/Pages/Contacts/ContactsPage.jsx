import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getCollectionFirebase } from '../../Api/firebaseApi';
import useUserStore from '../../Hooks/Zustand/Store';

const ContactsPage = () => {

  const globalState = useUserStore();
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4

  // const [allTokens, setAllTokens] = useState([]);





  const getData = async () => {
    const conditions = [
      { field: 'companyId', operator: '==', value: globalState.currentCompany },
      { field: 'projectId', operator: '==', value: globalState.currentProject },
    ];
    const sortBy = { field: 'createdAt', direction: 'desc' };
    const limitValue = startIndex + itemsPerPage;

    try {
      const res = await getCollectionFirebase('forms', conditions, sortBy, limitValue);

      if (res.length > 0) {
        // Jika data form ditemukan, ambil semua token dari res form dalam bentuk array
        const tokens = res.map((form) => form.token);
        console.log('Tokens:', tokens);
        // setAllTokens(tokens);

        // Selanjutnya, cari koleksi dengan nama "contacts" dengan formId sebagai string dalam tokens
        const contactsConditions = [{ field: 'formId', operator: 'in', value: tokens }];
        const contacts = await getCollectionFirebase('contacts', contactsConditions);
        console.log(contacts);
      }
    } catch (error) {
      console.log(error, 'ini error');
    }
  };


  const handleLoadMore = () => {
    setStartIndex(prev => prev + itemsPerPage); // Tambahkan jumlah data per halaman saat tombol "Load More" diklik
};


useEffect(() => {
    getData();

    return () => {

    };
}, [globalState.currentCompany, globalState.currentProject, startIndex]);

  return (
    <div>ContactsPage</div>
  )
}

export default ContactsPage