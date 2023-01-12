import { Heading, HStack, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { IoCaretBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import colors from '../Utils/colors'

function TermConditionPage() {

    const navigate = useNavigate()

    return (
        <Stack m={5}>
                        <HStack cursor='pointer' w={'100px'} mb={3}  p={2} alignItems='center' shadow={'base'} justifyContent={'center'} borderRadius='full' bgColor={colors.theme} onClick={() => navigate(-1)}>
                <IoCaretBackOutline size={15} />
                <Text fontSize={'xs'} letterSpacing={0.5}>Kembali</Text>
            </HStack>

            <Heading fontSize={'md'}>
                Syarat dan Ketentuan Mitra Belanja.co.id
            </Heading>
            <Text>
                Pengguna dalam hal ini, Mitra Belanja.co.id tunduk pada Kebijakan Privasi dan Syarat dan Ketentuan yang tertulis di bawah ini. Pengguna disarankan membaca dengan seksama karena dapat berdampak kepada hak dan kewajiban Pengguna secara hukum.Dengan mendaftar dan/atau menggunakan Mitra Belanja.co.id, maka Pengguna dianggap telah membaca, mengerti, memahami dan menyetujui semua isi dalam Syarat dan Ketentuan ini. Syarat dan Ketentuan ini merupakan bentuk kesepakatan yang dituangkan dalam sebuah perjanjian yang sah antara Pengguna dengan PT EDRUS PASAR DIGITAL. Jika Pengguna tidak menyetujui salah satu, sebagian, atau seluruh isi Syarat dan Ketentuan, maka Pengguna tidak diperkenankan menggunakan layanan
            </Text>

            <Heading fontSize={'sm'}>
                A. Definisi
            </Heading>

            <Text>
                Belanja.co.id adalah PT EDRUS PASAR DIGITAL dan seluruh afiliasi atau anak perusahaannya, suatu perseroan terbatas yang menjalankan kegiatan usaha jasa web portal www.belanja.co.id beserta segala situs turunan milik PT EDRUS PASAR DIGITAL, seperti situs pencarian Barang Fisik dan/atau Barang Digital yang dijual oleh Partner. Situs/Aplikasi adalah situs www.Belanja.co.id beserta segala situs turunan milik Belanja.co.id, termasuk namun tidak terbatas pada situs mitra.Belanja.co.id yang dapat diakses melalui desktop site, mobile web, dan/atau aplikasi yang berbasis Android atau iOS.

                Pengguna adalah pihak yang menggunakan layanan Belanja.co.id, termasuk namun tidak terbatas pada Mitra Belanja.co.id, Partner ataupun pihak lain yang sekedar berkunjung ke Situs/Aplikasi.

                MITRA adalah Pengguna yang bertindak selaku streamer terdaftar yang melakukan tindakan LIVE STREAM dan/atau melakukan penawaran atas suatu Barang kepada para Pengguna Situs Belanja.co.id, termasuk pihak ketiga yang bekerjasama dengan Belanja.co.id untuk menyediakan Barang Fisik dan/atau Barang Digital

                Barang Fisik adalah benda berwujud/memiliki fisik yang dapat diantar/memenuhi kriteria pengiriman oleh perusahaan penyedia jasa layanan pengiriman.

                Barang Digital adalah benda tidak berwujud/tidak memiliki fisik

                Ketentuan Situs adalah Syarat dan Ketentuan Situs/Aplikasi, Kebijakan Privasi, Syarat dan Ketentuan ini dan setiap syarat dan ketentuan lain yang dapat berlaku untuk atau sehubungan dengan penggunaan Situs/Aplikasi dan seluruh fitur yang terdapat di dalamnya.

                Syarat dan Ketentuan adalah Syarat dan Ketentuan untuk menggunakan Mitra Belanja.co.id.
            </Text>

            <Heading fontSize={'sm'}>
                B. Umum
            </Heading>

            <Text>
                Mitra Belanja.co.id hanya dapat digunakan oleh Pengguna yang telah mendaftarkan diri, menyetujui Syarat dan Ketentuan ini serta yang sudah diverifikasi sesuai kebijakan dari Belanja.co.id.

                Mitra Belanja.co.id dengan ini menyatakan bahwa Mitra Belanja.co.id adalah orang yang cakap dan mampu untuk mengikatkan dirinya dalam sebuah perjanjian yang sah menurut hukum.

                Belanja.co.id tidak memungut biaya pendaftaran kepada Mitra Belanja.co.id.

                Belanja.co.id berhak untuk menggunakan data Mitra Belanja.co.id untuk penelusuran indikasi manipulasi, pelanggaran maupun pemanfaatan fitur Belanja.co.id untuk keuntungan pribadi Mitra Belanja.co.id, maupun indikasi kecurangan atau pelanggaran Syarat dan Ketentuan ini, Ketentuan Situs, dan/atau ketentuan hukum yang berlaku di wilayah negara Indonesia.

                Belanja.co.id berhak, tanpa pemberitahuan sebelumnya, melakukan tindakan-tindakan yang diperlukan termasuk namun tidak terbatas pada penghentian penggunaan Situs/Aplikasi, membatalkan transaksi, menahan dana, menurunkan reputasi, menutup akun, serta hal-hal lainnya jika ditemukan adanya manipulasi, pelanggaran maupun pemanfaatan untuk keuntungan pribadi Mitra Belanja.co.id, maupun indikasi kecurangan atau pelanggaran Syarat dan Ketentuan ini, Ketentuan Situs, dan/atau ketentuan hukum yang berlaku di wilayah negara Indonesia.

                Belanja.co.id berhak melakukan perubahan atas Syarat dan Ketentuan ini.
            </Text>

            <Heading fontSize={'sm'}>
                C. Pengajuan Mitra Belanja.co.id
            </Heading>

            <Text>
                Untuk dapat menjadi Mitra Belanja.co.id, Pengguna harus mengajukan permohonan melalui formulir daring yang telah disediakan oleh Belanja.co.id.

                Proses verifikasi akan dilakukan oleh Belanja.co.id dalam jangka waktu 2x24 jam atau jangka waktu lain sesuai dengan kebijakan Belanja.co.id.

                Mitra Belanja.co.id menjamin dan bertanggungjawab atas keabsahan informasi dan dokumen yang diberikan dalam mengajukan permohonan untuk mendaftar sebagai Mitra Belanja.co.id.

                Mitra Belanja.co.id menyetujui bahwa informasi dan dokumen yang diberikan pada saat melakukan pendaftaran dapat dibagikan dan/atau disampaikan oleh Belanja.co.id kepada pihak ketiga untuk proses pelaksanaan verifikasi atau kegiatan lainnya sehubungan dengan pendaftaran Mitra Belanja.co.id.

                Mitra Belanja.co.id menyetujui dan memberikan wewenang kepada Belanja.co.id untuk mengumpulkan dan mengolah informasi yang terdapat dalam formulir laman Mitra Belanja.co.id pada Situs/Aplikasi kepada Partner.

                Pengguna menyetujui dan memberikan wewenang kepada Belanja.co.id untuk memberikan informasi dan/atau data relevan lainnya pada Situs/Aplikasi yang dibutuhkan oleh Partner.
            </Text>

            <Heading fontSize={'sm'}>
                D. Akun, Password, dan Keamanan
            </Heading>

            <Text>
                Belanja.co.id tanpa pemberitahuan terlebih dahulu kepada Mitra Belanja.co.id, memiliki kewenangan untuk melakukan tindakan yang perlu atas setiap dugaan pelanggaran atau pelanggaran Syarat dan Ketentuan ini dan/atau hukum yang berlaku, yakni tindakan berupa suspensi akun, dan/atau penghapusan akun Mitra Belanja.co.id.

                Mitra Belanja.co.id dilarang untuk menciptakan dan/atau menggunakan perangkat, software, fitur dan/atau alat lainnya yang bertujuan untuk melakukan manipulasi pada sistem Belanja.co.id, termasuk namun tidak terbatas pada: (i) manipulasi data; (ii) kegiatan peramban (crawling/scraping); (iii) kegiatan otomatisasi dalam transaksi, jual beli, promosi, dsb; dan/atau (iv) aktivitas lain yang secara wajar dapat dinilai sebagai tindakan manipulasi sistem.

                Belanja.co.id memiliki kewenangan untuk melakukan tindakan yang diperlukan yang mengakibatkan Mitra Belanja.co.id tidak dapat menggunakan Saldo Mitra apabila ditemukan/diduga adanya tindak kecurangan dalam bertransaksi dan/atau pelanggaran terhadap Syarat dan Ketentuan ini dan/atau Ketentuan Situs.

                Pengguna bertanggung jawab secara pribadi untuk menjaga kerahasiaan akun dan password untuk semua aktivitas yang terjadi dalam akun Pengguna.

                Belanja.co.id tidak akan meminta username, password maupun kode SMS verifikasi atau kode one time password (“OTP”) milik akun Pengguna untuk alasan apapun, oleh karena itu, Belanja.co.id menghimbau Pengguna agar tidak memberikan data tersebut maupun data penting lainnya kepada pihak yang mengatasnamakan Belanja.co.id atau pihak lain yang tidak dapat dijamin keamanannya.

                Pengguna setuju untuk memastikan bahwa Pengguna keluar dari akun di akhir setiap sesi dan memberitahu Belanja.co.id jika ada penggunaan tanpa izin atas sandi atau akun Pengguna.

                Pengguna dengan ini menyatakan bahwa Belanja.co.id tidak bertanggung jawab atas kerugian ataupun kendala yang timbul atas penyalahgunaan akun Pengguna yang diakibatkan oleh kelalaian Pengguna, termasuk namun tidak terbatas pada meminjamkan atau memberikan akses akun kepada pihak lain, mengakses link atau tautan yang diberikan oleh pihak lain, memberikan atau memperlihatkan kode verifikasi OTP, password atau email kepada pihak lain, maupun kelalaian Pengguna lainnya yang mengakibatkan kerugian ataupun kendala pada akun Pengguna.

                Pengguna memahami dan menyetujui bahwa untuk mempergunakan fasilitas keamanan OTP maka penyedia jasa telekomunikasi terkait dapat sewaktu-waktu mengenakan biaya kepada Pengguna dengan nominal sebagai berikut (i) Rp 500, - (lima ratus rupiah) ditambah  Pajak Pertambahan Nilai (PPN) dengan tarif sesuai ketentuan peraturan perpajakan yang berlaku di Indonesia untuk Indosat, Tri, XL, Smartfren, dan Esia; dan (ii) Rp 200,- (dua ratus rupiah) ditambah  Pajak Pertambahan Nilai (PPN) dengan tarif sesuai ketentuan peraturan perpajakan yang berlaku di Indonesia untuk Telkomsel.

            </Text>

            <Heading fontSize={'sm'}>
                E. Transaksi
            </Heading>

            <Text>
                Pengguna wajib bertransaksi melalui prosedur transaksi yang telah ditetapkan oleh Belanja.co.id.
            </Text>

            <Heading fontSize={'sm'}>
                F. Harga
            </Heading>

            <Text>

                Harga Barang Fisik yang terdapat dalam Situs/Aplikasi adalah harga yang ditetapkan oleh Partner.

                Pengguna memahami dan menyetujui bahwa kesalahan keterangan harga dan informasi lainnya yang disebabkan tidak terbaharuinya Situs/Aplikasi dikarenakan browser/ISP yang dipakai Pengguna adalah tanggung jawab Pengguna.

                Pengguna memahami dan menyetujui bahwa setiap masalah dan/atau perselisihan yang terjadi akibat ketidaksepahaman antara Mitra Belanja.co.id dan Partner tentang harga bukanlah merupakan tanggung jawab Belanja.co.id.

                Dengan melakukan pemesanan melalui Belanja.co.id, Mitra Belanja.co.id menyetujui untuk membayar total biaya yang harus dibayarkan sebagaimana tertera dalam halaman pembayaran, yang terdiri dari harga barang, dan biaya-biaya lain yang mungkin timbul dan akan diuraikan secara tegas dalam halaman pembayaran.

            </Text>

            <Heading fontSize={'sm'}>
                G. Pengiriman Barang Fisik
            </Heading>

            <Text>
                Pengiriman barang ditujukan ke alamat yang terdaftar saat Pengguna melakukan check out. Setelah Pengguna check out, Pengguna tidak dapat mengubah alamat pengiriman tersebut.

                Pengiriman Barang Fisik kepada Mitra Belanja.co.id akan dilakukan melalui penyedia jasa layanan pengiriman yang telah ditentukan oleh Belanja.co.id.

                Setiap ketentuan berkenaan dengan proses pengiriman Barang Fisik adalah wewenang sepenuhnya penyedia jasa layanan pengiriman.

                Pengguna memahami dan menyetujui bahwa setiap permasalahan yang terjadi pada saat proses pengiriman Barang Fisik oleh penyedia jasa layanan pengiriman adalah merupakan tanggung jawab penyedia jasa layanan pengiriman.

            </Text>


            <Heading fontSize={'sm'}>
                H. Chat Belanja.co.id
            </Heading>

            <Text>
                Chat Mitra Belanja.co.id adalah mekanisme yang disediakan oleh Belanja.co.id untuk memfasilitasi penyelesaian kendala yang dialami oleh Mitra Belanja.co.id.

                Ketika Pengguna menggunakan Chat Mitra Belanja.co.id, Mitra Belanja.co.id hanya melakukan komunikasi dengan Belanja.co.id sehingga tidak ada komunikasi antar Pengguna.

                Komunikasi yang dilakukan melalui Live Chat Mitra Belanja.co.id menggunakan fitur Chat yang disediakan oleh Belanja.co.id.

                Penyelesaian kendala melalu Chat Mitra Belanja.co.id dapat berupa solusi yang dihasilkan berdasarkan kesepakatan bersama antara Belanja.co.id, Partner dan Mitra Belanja.co.id.

                Pengguna setuju untuk tidak memberikan informasi sensitif, seperti password, OTP, maupun informasi lainnya yang terkait dengan mekanisme autentikasi.

            </Text>


            <Heading fontSize={'sm'}>
                I. Penolakan Jaminan dan Batasan Tanggung JawabBelanja.co.id adalah suatu perusahaan portal web yang menyediakan platform dalam menyediakan layanan kepada Pengguna untuk dapat menjadi Partner maupun Mitra Belanja.co.id di Situs/Aplikasi. Dengan demikian transaksi yang terjadi adalah transaksi antar Pengguna, sehingga Pengguna memahami bahwa batasan tanggung jawab Belanja.co.id secara proporsional adalah sebagai penyedia jasa portal web.

            </Heading>

            <Text>

                Belanja.co.id selalu berupaya untuk menjaga Situs/Aplikasi aman, nyaman, dan berfungsi dengan baik, tapi Belanja.co.id tidak dapat menjamin operasi terus-menerus atau akses ke Situs/Aplikasi dapat selalu sempurna. Informasi dan data dalam Situs/Aplikasi memiliki kemungkinan tidak terjadi secara real time.

                Pengguna setuju bahwa dengan memanfaatkan Situs/Aplikasi atas risiko Pengguna sendiri, dan Situs/Aplikasi diberikan kepada Pengguna pada "SEBAGAIMANA ADANYA" dan "SEBAGAIMANA TERSEDIA".

                Sejauh diizinkan oleh hukum yang berlaku, Belanja.co.id (termasuk Induk Perusahaan, direktur, dan karyawan) adalah tidak bertanggung jawab, dan Pengguna setuju untuk tidak menuntut Belanja.co.id bertanggung jawab, atas ssegala kerusakan atau kerugian (termasuk namun tidak terbatas pada hilangnya uang, reputasi, keuntungan, atau kerugian tak berwujud lainnya) yang diakibatkasn secara langsung atau tidak langsung dari:

                Penggunaan atau ketidakmampuan Pengguna dalam menggunakan Situs/Aplikasi.

                Harga, pengiriman atau petunjuk lain yang tersedia dalam Situs/Aplikasi.

                Keterlambatan atau gangguan dalam Situs/Aplikasi.

                Kelalaian dan kerugian yang ditimbulkan oleh Pengguna.

                Kualitas Barang Fisik.

                Pengiriman Barang Fisik.

                Pelanggaran Hak atas Kekayaan Intelektual.

                Perselisihan antar Pengguna.

                Pencemaran nama baik pihak lain.

                Setiap penyalahgunaan Barang Fisik yang sudah dibeli oleh Mitra Belanja.co.id.

                Pengiriman untuk perbaikan Barang Fisik yang bergaransi resmi dari pihak produsen. Mitra Belanja.co.id dapat membawa Barang langsung kepada pusat layanan servis terdekat dengan kartu garansi dan faktur Penggunaan.

                Virus atau perangkat lunak berbahaya lainnya (bot, script, automation tool selain fitur Gold Merchant, hacking tool) yang diperoleh dengan mengakses, atau menghubungkan ke Situs/Aplikasi.

                Gangguan, bug, kesalahan atau ketidakakuratan apapun dalam Situs/Aplikasi.

                Kerusakan pada perangkat keras Pengguna dari penggunaan Situs/Aplikasi.

                Isi, tindakan, atau tidak adanya tindakan dari pihak ketiga, termasuk terkait dengan Barang Fisik dan/atau Barang Digital yang ada dalam Situs/Aplikasi yang diduga palsu.

                Tindakan penegakan yang diambil sehubungan dengan akun Pengguna.

                Adanya tindakan peretasan yang dilakukan oleh pihak ketiga kepada akun Pengguna.

            </Text>


            <Heading fontSize={'sm'}>
                J. Pelepasan
            </Heading>

            <Text>
                Apabila Mitra Belanja.co.id memiliki perselisihan dengan satu atau lebih Mitra Belanja.co.id lainnya, Mitra
                Belanja.co.id melepaskan Belanja.co.id (termasuk Induk Perusahaan, Direktur, dan karyawan) dari klaim dan tuntutan atas kerusakan dan kerugian (aktual dan tersirat) dari setiap jenis dan sifatnya, yang dikenal dan tidak dikenal, yang timbul dari atau dengan cara apapun berhubungan dengan sengketa tersebut. Dengan demikian maka Mitra Belanja.co.id dengan sengaja melepaskan segala perlindungan hukum (yang terdapat dalam undang-undang atau peraturan hukum yang lain) yang akan membatasi cakupan ketentuan pelepasan ini.
            </Text>

            <Heading fontSize={'sm'}>
                K. Ganti Rugi
            </Heading>

            <Text>
                Mitra Belanja.co.id akan melepaskan Belanja.co.id dari tuntutan ganti rugi dan menjaga Belanja.co.id (termasuk Induk Perusahaan, direktur, dan karyawan) dari setiap klaim atau tuntutan, termasuk biaya hukum yang wajar, yang dilakukan oleh pihak ketiga yang timbul dalam hal Mitra Belanja.co.id melanggar Perjanjian ini, penggunaan Situs/Aplikasi yang tidak semestinya dan/atau pelanggaran Mitra Belanja.co.id terhadap hukum atau hak-hak pihak ketiga.
            </Text>

            <Heading fontSize={'sm'}>
                L. Pilihan Hukum
            </Heading>

            <Text>

                Syarat dan Ketentuan ini akan diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia, tanpa memperhatikan pertentangan aturan hukum. Mitra Belanja.co.id setuju bahwa tindakan hukum apapun atau sengketa yang mungkin timbul dari, berhubungan dengan, atau berada dalam cara apapun sehubungan dengan Situs/Aplikasi dan/atau Syarat dan Ketentuan ini akan diselesaikan secara eksklusif dalam wilayah hukum yang termasuk dalam yurisdiksi Belanja.co.id.

            </Text>

            <Heading fontSize={'sm'}>
                M. Pembaruan
            </Heading>

            <Text>

                Syarat dan Ketentuan ini mungkin diubah dan/atau diperbaharui dari waktu ke waktu tanpa pemberitahuan sebelumnya. Belanja.co.id menyarankan agar Mitra Belanja.co.id membaca secara seksama dan memeriksa halaman Syarat dan ketentuan ini dari waktu ke waktu untuk mengetahui perubahan apapun. Dengan tetap mengakses dan menggunakan Situs/Aplikasi, maka Mitra Belanja.co.id dianggap menyetujui perubahan-perubahan dalam Syarat dan Ketentuan ini.

            </Text>

        </Stack>
    )
}

export default TermConditionPage