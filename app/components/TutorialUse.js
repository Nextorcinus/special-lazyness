"use client";

import Image from "next/image";

export default function TutorialUsed() {
	return (
		<>
			<h2 className="text-xl text-white bold pt-4">Tutorial War Academy</h2>
			<div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
				<h3 className="text-white text-lg font-semibold">
					1. Pilih Tipe Troops
				</h3>

				<div className="flex flex-col md:flex-row gap-4 items-start">
					<Image
						src="/icon-menu/tutorial/pilihan1.jpg"
						alt="Tipe Troops"
						width={400}
						height={200}
						className=" object-cover"
					/>

					<p className="text-white/80 text-md leading-relaxed">
						pilih troops yang akan dihitung, dari Infantry, Lancer, Atau
						Marksman
					</p>
				</div>
			</div>
			<div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
				<h3 className="text-white text-lg font-semibold">2. Pilih Category</h3>

				<div className="flex flex-col md:flex-row gap-4 items-start">
					<Image
						src="/icon-menu/tutorial/pilihan2.jpg"
						alt="choose category"
						width={400}
						height={200}
						className="rounded-lg object-cover"
					/>
					<Image
						src="/icon-menu/tutorial/pilihan9.webp"
						alt="choose tipe category"
						width={400}
						height={200}
						className="rounded-lg object-cover"
					/>

					<p className="text-white/80 text-md leading-relaxed">
						pilih category berdasarkan kebutuhan, misal infantry dan belum
						lakukan upgrade berarti hitung dari "Flame Squad". category ini bisa
						di geser dengan mouse atau dengan jari di hp.
					</p>
				</div>
			</div>
			<div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
				<h3 className="text-white text-lg font-semibold">3. Choose Level</h3>

				<div className="flex flex-col md:flex-row gap-4 items-start">
					<Image
						src="/icon-menu/tutorial/pilihan3.jpg"
						alt="level choose"
						width={400}
						height={200}
						className="rounded-lg object-cover"
					/>
					<Image
						src="/icon-menu/tutorial/pilihan8.jpg"
						alt="research speed"
						width={400}
						height={200}
						className="rounded-lg object-cover"
					/>

					<p className="text-white/80 text-md leading-relaxed">
						pada saat category telah dipilih, akan muncul level-level yang bisa
						dipilih, pilih level sesuai dengan level troops yang ingin dihitung.
						misal untuk "Flame Squad" select from 0, to 5 (paling max). 2. isi
						Research Speed. lihat pada bonus overview untuk melihat berapa
						persen bonus yang dipunyai. ini untuk mengurangi waktu default hasil
						kalkulasi. 3. VP 10% dan 20%. ini didapat dari menjabat ministry
						Vice of President di President Perks. jika mengambil itu dan
						melalukan upgrade berarti ini dicentang, tujuannya adalah
						menambahkan bonus extra speed Research 10%. 20% terjadi jika
						president mengaktifkan skill speed research dan kalian mengambil
						ministry maka dihitung menjadi 20%.
					</p>
				</div>
			</div>
			<div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
				<h3 className="text-white text-lg font-semibold">
					4. Hasil Calculation
				</h3>

				<div className="flex flex-col md:flex-row gap-4 items-start">
					<Image
						src="/icon-menu/tutorial/pilihan4.jpg"
						alt="calculation"
						width={400}
						height={200}
						className="rounded-lg object-cover"
					/>

					<p className="text-white/80 text-md leading-relaxed">
						hasil kalkulasi keluar seperti ini, ini adalah resources yang
						dibutuhkan berdasar kalkulasi dari "Level From" dan "Level to".
						serta waktu yang standard WOS. dan hasil pengurangan research speed
						dan buff yang dimiliki.
					</p>
				</div>
			</div>
			<div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
				<h3 className="text-white text-lg font-semibold">5. Total Result</h3>

				<div className="flex flex-col md:flex-row gap-4 items-start">
					<Image
						src="/icon-menu/tutorial/pilihan5.jpg"
						alt="Total Result"
						width={400}
						height={200}
						className="rounded-lg object-cover"
					/>

					<p className="text-white/80 text-md leading-relaxed">
						dibagian ini adalah total dari semua hasil kalkulasi, ini adalah
						resources yang dibutuhkan untuk melakukan upgrade dari level awal ke
						level tujuan. ini sudah termasuk dengan research speed dan buff yang
						dimiliki. jadi ini adalah hasil akhir yang dibutuhkan untuk
						melakukan upgrade. termasuk jika kalian melakukan perhitungan ke
						semua kategori, maka hasil total result ini adalah total dari semua
						kategori yang dihitung. jadi ini adalah resources yang dibutuhkan
						untuk melakukan upgrade ke semua kategori yang dihitung.
					</p>
				</div>
			</div>
			<div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
				<h3 className="text-white text-lg font-semibold">6. Compare</h3>

				<div className="flex flex-col md:flex-row gap-4 items-start">
					<Image
						src="/icon-menu/tutorial/pilihan6.jpg"
						alt="Compare"
						width={400}
						height={200}
						className="rounded-lg object-cover"
					/>
					<Image
						src="/icon-menu/tutorial/pilihan7.jpg"
						alt="Compare"
						width={400}
						height={200}
						className="rounded-lg object-cover"
					/>

					<p className="text-white/80 text-md leading-relaxed">
						kalian bisa melakukan komparasi dengan resources yang kalian punya,
						jadi kalian bisa lihat apakah resources yang kalian punya cukup
						untuk melakukan upgrade atau tidak. jika kalian punya lebih maka
						akan muncul warna hijau dengan label +, jika kurang maka akan muncul
						warna merah dengan label -, dan jika pas maka akan muncul warna
						netral dengan label match.
					</p>
				</div>
			</div>
		</>
	);
}
