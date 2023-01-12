import { Heading, HStack, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { IoCaretBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import colors from '../Utils/colors'

function HelpPage() {

    const navigate = useNavigate()
    return (
        <Stack m={5}>

            <HStack cursor='pointer' w={'100px'} mb={3} p={2} alignItems='center' shadow={'base'} justifyContent={'center'} borderRadius='full' bgColor={colors.theme} onClick={() => navigate(-1)}>
                <IoCaretBackOutline size={15} />
                <Text fontSize={'xs'} letterSpacing={0.5}>Kembali</Text>
            </HStack>

            <Heading fontSize={'md'}>
                Kebijakan Privasi
            </Heading>
            <Text>
                Adanya Kebijakan Privasi ini adalah komitmen nyata dari Belanja.co.id untuk menghargai dan melindungi setiap data atau informasi pribadi Pengguna situs www.Belanja.co.id Kebijakan Privasi ini menetapkan dasar atas perolehan, pengumpulan, pengolahan, penganalisisan, penampilan, pengiriman, pembukaan, penyimpanan, perubahan, penghapusan dan/atau segala bentuk pengelolaan yang terkait dengan data atau informasi yang mengidentifikasikan atau dapat digunakan untuk mengidentifikasi Pengguna yang Pengguna berikan kepada Belanja.co.id atau yang Belanja.co.id kumpulkan dari Pengguna maupun pihak ketiga (selanjutnya disebut sebagai "Data Pribadi").Dengan mengklik “Daftar” (Register) atau pernyataan serupa yang tersedia di laman pendaftaran Situs, Pengguna menyatakan bahwa setiap Data Pribadi Pengguna merupakan data yang benar dan sah, Pengguna mengakui bahwa ia telah diberitahukan dan memahami ketentuan Kebijakan Privasi ini serta Pengguna memberikan persetujuan kepada Belanja.co.id untuk memperoleh, mengumpulkan, mengolah, menganalisis, menampilkan, mengirimkan, membuka, menyimpan, mengubah, menghapus, mengelola dan/atau mempergunakan data tersebut untuk tujuan sebagaimana tercantum dalam Kebijakan Privasi.
                <br />
                1. Perolehan dan Pengumpulan Data Pribadi Pengguna
                <br />
                2. Penggunaan Data Pribadi
                <br />
                3. Pengungkapan Data Pribadi Pengguna
                <br />
                4. Cookies
                <br />
                5. Pilihan Pengguna dan Transparansi
                <br />
                6. Keamanan, Penyimpanan dan Penghapusan Data Pribadi Pengguna
                <br />
                7. Akses dan Perbaikan Data Pribadi Pengguna atau Penarikan Kembali Persetujuan
                <br />
                8. Pengaduan terkait Perlindungan Data Pribadi Pengguna
                <br />
                9. Hubungi Kami
                <br />
                10. Penyimpanan, Permohonan Subjek Data dan Penghapusan Informasi
                <br />
                11. Pembaruan Kebijakan Privasi
            </Text>

            <Heading fontSize={'md'}>
                A. Perolehan dan Pengumpulan Data Pribadi Pengguna
            </Heading>
            <Text>
                Belanja.co.id mengumpulkan Data Pribadi Pengguna dengan tujuan untuk memproses transaksi Pengguna, mengelola dan memperlancar proses penggunaan Situs, serta tujuan-tujuan lainnya selama diizinkan oleh peraturan perundang-undangan yang berlaku. Adapun data Pengguna yang dikumpulkan adalah sebagai berikut:
                1. Data yang diserahkan secara mandiri oleh Pengguna, termasuk namun tidak terbatas pada data yang diserahkan pada saat Pengguna:
                <br />
                2. membuat atau memperbarui akun Belanja.co.id, termasuk diantaranya nama pengguna (username), alamat email, nomor telepon, password, alamat, foto, dan informasi lainnya yang dapat mengidentifikasi Pengguna;
                <br />
                3. menghubungi Belanja.co.id, termasuk melalui layanan pelanggan (customer service);
                <br />
                4.cmengisi survei yang dikirimkan oleh Belanja.co.id atau pihak lain yang ditunjuk secara resmi untuk mewakili Belanja.co.id;
                <br />
                5. mempergunakan layanan-layanan pada Situs, termasuk data transaksi yang detil, diantaranya jenis, jumlah dan/atau keterangan dari produk atau layanan yang dibeli, alamat pengiriman, kanal pembayaran yang digunakan, jumlah transaksi, tanggal dan waktu transaksi, serta detil transaksi lainnya;
                <br />
                6. mengisi data-data pembayaran pada saat Pengguna melakukan aktivitas transaksi pembayaran melalui Situs, termasuk namun tidak terbatas pada data rekening bank, kartu kredit, virtual account, instant payment, internet banking, gerai ritel; dan/atau
                <br />
                7. mengisi data-data detail mengenai alamat pengiriman (untuk Pembeli), alamat penjemputan dan lokasi toko (untuk Penjual), termasuk namun tidak terbatas pada data alamat lengkap, titik koordinat lokasi berupa longitude latitude, nomor telepon, dan nama yang tercantum saat melakukan penyimpanan data di Belanja.co.id.
                <br />
                8. menggunakan fitur pada Situs yang membutuhkan izin akses ke data yang relevan yang tersimpan dalam perangkat Pengguna.
                <br />
                9. Data yang terekam pada saat Pengguna mempergunakan Situs, termasuk namun tidak terbatas pada:
                <br />
                10. data lokasi riil atau perkiraannya seperti alamat IP, lokasi Wi-Fi dan geo-location;
                <br />
                11. data berupa waktu dari setiap aktivitas Pengguna sehubungan dengan penggunaan Situs, termasuk waktu pendaftaran, login dan transaksi;
                <br />
                12. data penggunaan atau preferensi Pengguna, diantaranya interaksi Pengguna dalam menggunakan Situs, pilihan yang disimpan, serta pengaturan yang dipilih. Data tersebut diperoleh menggunakan cookies, pixel tags, dan teknologi serupa yang menciptakan dan mempertahankan pengenal unik;
                <br />
                13. data perangkat, diantaranya jenis perangkat yang digunakan untuk mengakses Situs, termasuk model perangkat keras, sistem operasi dan versinya, perangkat lunak, nomor IMEI, nama file dan versinya, pilihan bahasa, pengenal perangkat unik, pengenal iklan, nomor seri, informasi gerakan perangkat, dan/atau informasi jaringan seluler; dan/atau
                <br />
                14. data catatan (log), diantaranya catatan pada server yang menerima data seperti alamat IP perangkat, tanggal dan waktu akses, fitur aplikasi atau laman yang dilihat, proses kerja aplikasi dan aktivitas sistem lainnya, jenis peramban (browser), dan/atau situs atau layanan pihak ketiga yang Pengguna gunakan sebelum berinteraksi dengan Situs.
                <br />
                15. Data yang diperoleh dari sumber lain, termasuk namun tidak terbatas pada:
                <br />
                16. data berupa geo-location (GPS) dari mitra usaha Belanja.co.id yang turut membantu Belanja.co.id dalam mengembangkan dan menyajikan layanan-layanan dalam Situs kepada Pengguna, antara lain mitra penyedia layanan pembayaran, logistik atau kurir, infrastruktur situs, dan mitra- mitra lainnya.
                <br />
                17, data berupa email, nomor telepon, nama, gender, dan/atau tanggal lahir dari mitra usaha Belanja.co.id tempat Pengguna membuat atau mengakses akun Belanja.co.id, seperti layanan media sosial, atau situs/aplikasi yang menggunakan application programming interface (API) Belanja.co.id atau yang digunakan Belanja.co.id;
                <br />
                18. data dari penyedia layanan finansial, termasuk namun tidak terbatas pada lembaga atau biro pemeringkat kredit atau Lembaga Pengelola Informasi Perkreditan (LPIP);
                <br />
                19. data dari penyedia layanan finansial (apabila Pengguna menggunakan fitur spesifik seperti mengajukan pinjaman melalui Situs/Aplikasi Belanja.co.id); dan/atau
                <br />
                20. data berupa email dari penyedia layanan pemasaran.
            </Text>

            <Heading fontSize={'md'}>
                A. Perolehan dan Pengumpulan Data Pribadi Pengguna
            </Heading>
            <Text>
                Belanja.co.id mengumpulkan Data Pribadi Pengguna dengan tujuan untuk memproses transaksi Pengguna, mengelola dan memperlancar proses penggunaan Situs, serta tujuan-tujuan lainnya selama diizinkan oleh peraturan perundang-undangan yang berlaku. Adapun data Pengguna yang dikumpulkan adalah sebagai berikut:
                1. Data yang diserahkan secara mandiri oleh Pengguna, termasuk namun tidak terbatas pada data yang diserahkan pada saat Pengguna:
                <br />
                2. membuat atau memperbarui akun Belanja.co.id, termasuk diantaranya nama pengguna (username), alamat email, nomor telepon, password, alamat, foto, dan informasi lainnya yang dapat mengidentifikasi Pengguna;
                <br />
                3. menghubungi Belanja.co.id, termasuk melalui layanan pelanggan (customer service);
                <br />
                4.cmengisi survei yang dikirimkan oleh Belanja.co.id atau pihak lain yang ditunjuk secara resmi untuk mewakili Belanja.co.id;
                <br />
                5. mempergunakan layanan-layanan pada Situs, termasuk data transaksi yang detil, diantaranya jenis, jumlah dan/atau keterangan dari produk atau layanan yang dibeli, alamat pengiriman, kanal pembayaran yang digunakan, jumlah transaksi, tanggal dan waktu transaksi, serta detil transaksi lainnya;
                <br />
                6. mengisi data-data pembayaran pada saat Pengguna melakukan aktivitas transaksi pembayaran melalui Situs, termasuk namun tidak terbatas pada data rekening bank, kartu kredit, virtual account, instant payment, internet banking, gerai ritel; dan/atau
                <br />
                7. mengisi data-data detail mengenai alamat pengiriman (untuk Pembeli), alamat penjemputan dan lokasi toko (untuk Penjual), termasuk namun tidak terbatas pada data alamat lengkap, titik koordinat lokasi berupa longitude latitude, nomor telepon, dan nama yang tercantum saat melakukan penyimpanan data di Belanja.co.id.
                <br />
                8. menggunakan fitur pada Situs yang membutuhkan izin akses ke data yang relevan yang tersimpan dalam perangkat Pengguna.
                <br />
                9. Data yang terekam pada saat Pengguna mempergunakan Situs, termasuk namun tidak terbatas pada:
                <br />
                10. data lokasi riil atau perkiraannya seperti alamat IP, lokasi Wi-Fi dan geo-location;
                <br />
                11. data berupa waktu dari setiap aktivitas Pengguna sehubungan dengan penggunaan Situs, termasuk waktu pendaftaran, login dan transaksi;
                <br />
                12. data penggunaan atau preferensi Pengguna, diantaranya interaksi Pengguna dalam menggunakan Situs, pilihan yang disimpan, serta pengaturan yang dipilih. Data tersebut diperoleh menggunakan cookies, pixel tags, dan teknologi serupa yang menciptakan dan mempertahankan pengenal unik;
                <br />
                13. data perangkat, diantaranya jenis perangkat yang digunakan untuk mengakses Situs, termasuk model perangkat keras, sistem operasi dan versinya, perangkat lunak, nomor IMEI, nama file dan versinya, pilihan bahasa, pengenal perangkat unik, pengenal iklan, nomor seri, informasi gerakan perangkat, dan/atau informasi jaringan seluler; dan/atau
                <br />
                14. data catatan (log), diantaranya catatan pada server yang menerima data seperti alamat IP perangkat, tanggal dan waktu akses, fitur aplikasi atau laman yang dilihat, proses kerja aplikasi dan aktivitas sistem lainnya, jenis peramban (browser), dan/atau situs atau layanan pihak ketiga yang Pengguna gunakan sebelum berinteraksi dengan Situs.
                <br />
                15. Data yang diperoleh dari sumber lain, termasuk namun tidak terbatas pada:
                <br />
                16. data berupa geo-location (GPS) dari mitra usaha Belanja.co.id yang turut membantu Belanja.co.id dalam mengembangkan dan menyajikan layanan-layanan dalam Situs kepada Pengguna, antara lain mitra penyedia layanan pembayaran, logistik atau kurir, infrastruktur situs, dan mitra- mitra lainnya.
                <br />
                17, data berupa email, nomor telepon, nama, gender, dan/atau tanggal lahir dari mitra usaha Belanja.co.id tempat Pengguna membuat atau mengakses akun Belanja.co.id, seperti layanan media sosial, atau situs/aplikasi yang menggunakan application programming interface (API) Belanja.co.id atau yang digunakan Belanja.co.id;
                <br />
                18. data dari penyedia layanan finansial, termasuk namun tidak terbatas pada lembaga atau biro pemeringkat kredit atau Lembaga Pengelola Informasi Perkreditan (LPIP);
                <br />
                19. data dari penyedia layanan finansial (apabila Pengguna menggunakan fitur spesifik seperti mengajukan pinjaman melalui Situs/Aplikasi Belanja.co.id); dan/atau
                <br />
                20. data berupa email dari penyedia layanan pemasaran.
            </Text>

            <Heading fontSize={'md'}>
                B. Penggunaan Data Pribadi
            </Heading>
            <Text>
                Belanja.co.id dapat menggunakan Data Pribadi yang diperoleh dan dikumpulkan dari Pengguna sebagaimana disebutkan dalam bagian sebelumnya untuk hal-hal sebagai berikut:
                <br />
                1. Memproses segala bentuk permintaan, aktivitas maupun transaksi yang dilakukan oleh Pengguna melalui Situs, termasuk untuk keperluan pengiriman produk kepada Pengguna.
                <br />
                2. Penyediaan fitur-fitur untuk memberikan, mewujudkan, memelihara dan memperbaiki produk dan layanan kami, termasuk:
                <br />
                3. menawarkan, memperoleh, menyediakan, atau memfasilitasi layanan, rekomendasi produk pada Belanja.co.id Feed
                <br />
                4. memungkinkan fitur untuk mempribadikan (personalised) akun Belanja.co.id Pengguna, seperti Keranjang Belanja, Wishlist dan Toko Favorit; dan/atau
                <br />
                5. melakukan kegiatan internal yang diperlukan untuk menyediakan layanan pada situs/aplikasi Belanja.co.id, seperti pemecahan masalah software, bug, permasalahan operasional, melakukan analisis data, pengujian, dan penelitian, dan untuk memantau dan menganalisis kecenderungan penggunaan dan aktivitas.
                <br />
                6. Membantu Pengguna pada saat berkomunikasi dengan Layanan Pelanggan Belanja.co.id, diantaranya untuk:
                <br />
                7. memeriksa dan mengatasi permasalahan Pengguna;
                <br />
                8. mengarahkan pertanyaan Pengguna kepada petugas layanan pelanggan yang tepat untuk mengatasi permasalahan;
                <br />
                9. mengawasi dan memperbaiki tanggapan layanan pelanggan Belanja.co.id;
                <br />
                10. menghubungi Pengguna melalui email, surat, telepon, fax, dan metode komunikasi lainnya, termasuk namun tidak terbatas, untuk membantu dan/atau menyelesaikan proses transaksi maupun proses penyelesaian kendala, serta menyampaikan berita atau notifikasi lainnya sehubungan dengan perlindungan Data Pribadi Pengguna oleh Belanja.co.id, termasuk kegagalan perlindungan Data Pribadi Pengguna;
                <br />
                11. menggunakan informasi yang diperoleh dari Pengguna untuk tujuan penelitian, analisis, pengembangan dan pengujian produk guna meningkatkan keamanan layanan-layanan pada Situs, serta mengembangkan fitur dan produk baru; dan
                <br />
                12. menginformasikan kepada Pengguna terkait produk, layanan, promosi, studi, survei, berita, perkembangan terbaru, acara dan informasi lainnya, baik melalui Situs maupun melalui media lainnya. Belanja.co.id juga dapat menggunakan informasi tersebut untuk mempromosikan dan memproses kontes dan undian, memberikan hadiah, serta menyajikan iklan dan konten yang relevan tentang layanan Belanja.co.id dan mitra usahanya.
                <br />
                13. Melakukan
                <br />
                14. monitoring
                <br />
                15. ataupun investigasi terhadap transaksi-transaksi mencurigakan atau transaksi yang terindikasi mengandung unsur kecurangan atau pelanggaran terhadap Syarat dan Ketentuan atau ketentuan hukum yang berlaku, serta melakukan tindakan-tindakan yang diperlukan sebagai tindak lanjut dari hasil monitoring atau investigasi transaksi tersebut.
                <br />
                16. Dalam keadaan tertentu, Belanja.co.id mungkin perlu untuk menggunakan ataupun mengungkapkan Data Pribadi Pengguna untuk tujuan penegakan hukum atau untuk pemenuhan persyaratan dan kewajiban peraturan perundang-undangan yang berlaku, termasuk dalam hal terjadinya sengketa atau proses hukum antara Pengguna dan Belanja.co.id, atau dugaan tindak pidana seperti penipuan atau pencurian data.
                <br />
                17. Pemenuhan persyaratan dan kewajiban peraturan perundang-undangan yang berlaku sehubungan dengan kepentingan perpajakan di Indonesia.
                <br />
                18. Memfasilitasi transaksi penggabungan, penjualan aset perusahaan, konsolidasi atau restrukturisasi, pembiayaan atau akuisisi yang melibatkan Belanja.co.id.
            </Text>
            <Heading fontSize={'md'}>
                A. Perolehan dan Pengumpulan Data Pribadi Pengguna
            </Heading>
            <Text>
                Belanja.co.id mengumpulkan Data Pribadi Pengguna dengan tujuan untuk memproses transaksi Pengguna, mengelola dan memperlancar proses penggunaan Situs, serta tujuan-tujuan lainnya selama diizinkan oleh peraturan perundang-undangan yang berlaku. Adapun data Pengguna yang dikumpulkan adalah sebagai berikut:
                <br />
                1. Data yang diserahkan secara mandiri oleh Pengguna, termasuk namun tidak terbatas pada data yang diserahkan pada saat Pengguna:
                <br />
                2. membuat atau memperbarui akun Belanja.co.id, termasuk diantaranya nama pengguna (username), alamat email, nomor telepon, password, alamat, foto, dan informasi lainnya yang dapat mengidentifikasi Pengguna;
                <br />
                3. menghubungi Belanja.co.id, termasuk melalui layanan pelanggan (customer service);
                <br />
                4.cmengisi survei yang dikirimkan oleh Belanja.co.id atau pihak lain yang ditunjuk secara resmi untuk mewakili Belanja.co.id;
                <br />
                5. mempergunakan layanan-layanan pada Situs, termasuk data transaksi yang detil, diantaranya jenis, jumlah dan/atau keterangan dari produk atau layanan yang dibeli, alamat pengiriman, kanal pembayaran yang digunakan, jumlah transaksi, tanggal dan waktu transaksi, serta detil transaksi lainnya;
                <br />
                6. mengisi data-data pembayaran pada saat Pengguna melakukan aktivitas transaksi pembayaran melalui Situs, termasuk namun tidak terbatas pada data rekening bank, kartu kredit, virtual account, instant payment, internet banking, gerai ritel; dan/atau
                <br />
                7. mengisi data-data detail mengenai alamat pengiriman (untuk Pembeli), alamat penjemputan dan lokasi toko (untuk Penjual), termasuk namun tidak terbatas pada data alamat lengkap, titik koordinat lokasi berupa longitude latitude, nomor telepon, dan nama yang tercantum saat melakukan penyimpanan data di Belanja.co.id.
                <br />
                8. menggunakan fitur pada Situs yang membutuhkan izin akses ke data yang relevan yang tersimpan dalam perangkat Pengguna.
                <br />
                9. Data yang terekam pada saat Pengguna mempergunakan Situs, termasuk namun tidak terbatas pada:
                <br />
                10. data lokasi riil atau perkiraannya seperti alamat IP, lokasi Wi-Fi dan geo-location;
                <br />
                11. data berupa waktu dari setiap aktivitas Pengguna sehubungan dengan penggunaan Situs, termasuk waktu pendaftaran, login dan transaksi;
                <br />
                12. data penggunaan atau preferensi Pengguna, diantaranya interaksi Pengguna dalam menggunakan Situs, pilihan yang disimpan, serta pengaturan yang dipilih. Data tersebut diperoleh menggunakan cookies, pixel tags, dan teknologi serupa yang menciptakan dan mempertahankan pengenal unik;
                <br />
                13. data perangkat, diantaranya jenis perangkat yang digunakan untuk mengakses Situs, termasuk model perangkat keras, sistem operasi dan versinya, perangkat lunak, nomor IMEI, nama file dan versinya, pilihan bahasa, pengenal perangkat unik, pengenal iklan, nomor seri, informasi gerakan perangkat, dan/atau informasi jaringan seluler; dan/atau
                <br />
                14. data catatan (log), diantaranya catatan pada server yang menerima data seperti alamat IP perangkat, tanggal dan waktu akses, fitur aplikasi atau laman yang dilihat, proses kerja aplikasi dan aktivitas sistem lainnya, jenis peramban (browser), dan/atau situs atau layanan pihak ketiga yang Pengguna gunakan sebelum berinteraksi dengan Situs.
                <br />
                15. Data yang diperoleh dari sumber lain, termasuk namun tidak terbatas pada:
                <br />
                16. data berupa geo-location (GPS) dari mitra usaha Belanja.co.id yang turut membantu Belanja.co.id dalam mengembangkan dan menyajikan layanan-layanan dalam Situs kepada Pengguna, antara lain mitra penyedia layanan pembayaran, logistik atau kurir, infrastruktur situs, dan mitra- mitra lainnya.
                <br />
                17, data berupa email, nomor telepon, nama, gender, dan/atau tanggal lahir dari mitra usaha Belanja.co.id tempat Pengguna membuat atau mengakses akun Belanja.co.id, seperti layanan media sosial, atau situs/aplikasi yang menggunakan application programming interface (API) Belanja.co.id atau yang digunakan Belanja.co.id;
                <br />
                18. data dari penyedia layanan finansial, termasuk namun tidak terbatas pada lembaga atau biro pemeringkat kredit atau Lembaga Pengelola Informasi Perkreditan (LPIP);
                <br />
                19. data dari penyedia layanan finansial (apabila Pengguna menggunakan fitur spesifik seperti mengajukan pinjaman melalui Situs/Aplikasi Belanja.co.id); dan/atau
                <br />
                20. data berupa email dari penyedia layanan pemasaran.
                <br />
            </Text>
            <Heading fontSize={'md'}>
                B. Penggunaan Data Pribadi
            </Heading>
            <Text>
                Belanja.co.id dapat menggunakan Data Pribadi yang diperoleh dan dikumpulkan dari Pengguna sebagaimana disebutkan dalam bagian sebelumnya untuk hal-hal sebagai berikut:
                <br />
                1. Memproses segala bentuk permintaan, aktivitas maupun transaksi yang dilakukan oleh Pengguna melalui Situs, termasuk untuk keperluan pengiriman produk kepada Pengguna.
                <br />
                2. Penyediaan fitur-fitur untuk memberikan, mewujudkan, memelihara dan memperbaiki produk dan layanan kami, termasuk:
                <br />
                3. menawarkan, memperoleh, menyediakan, atau memfasilitasi layanan, rekomendasi produk pada Belanja.co.id Feed
                <br />
                4. memungkinkan fitur untuk mempribadikan (personalised) akun Belanja.co.id Pengguna, seperti Keranjang Belanja, Wishlist dan Toko Favorit; dan/atau
                <br />
                5. melakukan kegiatan internal yang diperlukan untuk menyediakan layanan pada situs/aplikasi Belanja.co.id, seperti pemecahan masalah software, bug, permasalahan operasional, melakukan analisis data, pengujian, dan penelitian, dan untuk memantau dan menganalisis kecenderungan penggunaan dan aktivitas.
                <br />
                6. Membantu Pengguna pada saat berkomunikasi dengan Layanan Pelanggan Belanja.co.id, diantaranya untuk:
                <br />
                7. memeriksa dan mengatasi permasalahan Pengguna;
                <br />
                8. mengarahkan pertanyaan Pengguna kepada petugas layanan pelanggan yang tepat untuk mengatasi permasalahan;
                <br />
                9. mengawasi dan memperbaiki tanggapan layanan pelanggan Belanja.co.id;
                <br />
                10. menghubungi Pengguna melalui email, surat, telepon, fax, dan metode komunikasi lainnya, termasuk namun tidak terbatas, untuk membantu dan/atau menyelesaikan proses transaksi maupun proses penyelesaian kendala, serta menyampaikan berita atau notifikasi lainnya sehubungan dengan perlindungan Data Pribadi Pengguna oleh Belanja.co.id, termasuk kegagalan perlindungan Data Pribadi Pengguna;
                <br />
                11. menggunakan informasi yang diperoleh dari Pengguna untuk tujuan penelitian, analisis, pengembangan dan pengujian produk guna meningkatkan keamanan layanan-layanan pada Situs, serta mengembangkan fitur dan produk baru; dan
                <br />
                12. menginformasikan kepada Pengguna terkait produk, layanan, promosi, studi, survei, berita, perkembangan terbaru, acara dan informasi lainnya, baik melalui Situs maupun melalui media lainnya. Belanja.co.id juga dapat menggunakan informasi tersebut untuk mempromosikan dan memproses kontes dan undian, memberikan hadiah, serta menyajikan iklan dan konten yang relevan tentang layanan Belanja.co.id dan mitra usahanya.
                13. Melakukan
                14. monitoring
                15. ataupun investigasi terhadap transaksi-transaksi mencurigakan atau transaksi yang terindikasi mengandung unsur kecurangan atau pelanggaran terhadap Syarat dan Ketentuan atau ketentuan hukum yang berlaku, serta melakukan tindakan-tindakan yang diperlukan sebagai tindak lanjut dari hasil monitoring atau investigasi transaksi tersebut.
                <br />
                16. Dalam keadaan tertentu, Belanja.co.id mungkin perlu untuk menggunakan ataupun mengungkapkan Data Pribadi Pengguna untuk tujuan penegakan hukum atau untuk pemenuhan persyaratan dan kewajiban peraturan perundang-undangan yang berlaku, termasuk dalam hal terjadinya sengketa atau proses hukum antara Pengguna dan Belanja.co.id, atau dugaan tindak pidana seperti penipuan atau pencurian data.
                <br />
                17. Pemenuhan persyaratan dan kewajiban peraturan perundang-undangan yang berlaku sehubungan dengan kepentingan perpajakan di Indonesia.
                <br />
                18. Memfasilitasi transaksi penggabungan, penjualan aset perusahaan, konsolidasi atau restrukturisasi, pembiayaan atau akuisisi yang melibatkan Belanja.co.id.
                <br />
            </Text>

        </Stack>
    )
}

export default HelpPage