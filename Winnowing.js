// const strJudulMahasiswa =
//   "PENENTUAN DOSEN PEMBIMBING TUGAS AKHIR JURUSAN TI Politeknik Negeri Padang DENGAN ALGORITMA AHP-WP DAN WINNOWING BERBASIS WEBSITE";

// ---------------Helpers---------------
const preProcessingText = (str = "") => {
  // a. Case Folding
  const lowerCaseStr = str?.toLowerCase();

  // b. White space remove
  const whiteSpaceRemoveStr = lowerCaseStr?.replaceAll(" ", "");

  // c. Pmbersihan tanda baca (punctuation cleaning)
  const pattern = /[^\w\s]|_/g;
  const punctClean = whiteSpaceRemoveStr?.replace(pattern, "");

  return punctClean;
};
const roundUp4 = (num = 0) =>
  Math.ceil(num * Math.pow(10, 4)) / Math.pow(10, 4);
// ---------------End---------------

// ---------------Winnowing Process---------------
const arrKGramHandler = ({ str, kGramCount = 3 }) => {
  const arrKGramDatas = [];

  for (let i = 0; i < str?.length; i++) {
    if (str.slice(i, i + kGramCount)?.length === kGramCount) {
      arrKGramDatas.push(str.slice(i, i + kGramCount));
    }
  }

  return arrKGramDatas;
};

// arrKGramHandler({ str: strJudulMahasiswa, kGramCount: 3 });

const rollingHashEachHandler = ({ str }) => {
  const asciiStrArr = [];
  const numArr = [];
  const RHEachArrDatas = []; // RH = Rolling Hash

  for (let i = 0; i < str.split("").length; i++) {
    const obj = str.split("")[i];
    asciiStrArr?.push(obj?.charCodeAt());
  }

  for (let i = asciiStrArr?.length - 1; i >= 0; i--) {
    numArr?.push(i);
  }

  for (let i = 0; i < asciiStrArr?.length; i++) {
    RHEachArrDatas?.push(asciiStrArr?.[i] * Math?.pow(11, numArr[i]));
  }

  return RHEachArrDatas?.reduce((total, curr) => {
    return (total += curr);
  }, 0);
};

// console.log(rollingHashEachHandler({ str: "pen" }));
// console.log(rollingHashEachHandler({ str: "ene" }));

const arrRollingHashHandler = ({ str, kGramCount }) => {
  const arrRH = [];
  arrKGramHandler({ str, kGramCount })?.forEach((dataKGramStr) => {
    arrRH?.push(rollingHashEachHandler({ str: dataKGramStr }));
  });

  return arrRH;
};

const windowHandler = ({ str, kGramCount, windowCount }) => {
  const windowArrDatas = [];
  const arrRHDatas = arrRollingHashHandler({ str, kGramCount });

  for (let i = 0; i < arrRHDatas?.length; i++) {
    windowArrDatas?.push(arrRHDatas?.slice(i, i + windowCount));
  }
  return windowArrDatas;
};

const fingerPrintHandler = ({ str, kGramCount, windowCount }) => {
  const arrFingerPrint = windowHandler({ str, kGramCount, windowCount })?.map(
    (windowData) => {
      return windowData?.reduce((lowVal, curr) => {
        return Math.min(lowVal, curr);
      });
    }
  );

  return [...new Set(arrFingerPrint)]; // kalau ada angka sama, bakal ambil salah satu, emg dari penelitiannya gitu
};

// document.getElementById("app").textContent = windowHandler({
//   str: preProcessingText(strJudulMahasiswa),
//   kGramCount: 3,
//   windowCount: 5,
// });
const jaccardSimilarityHandler = ({
  strJudulMhs,
  strJudulPenelitian,
  kGramCount,
  windowCount,
}) => {
  const sameArr = fingerPrintHandler({
    str: strJudulMhs,
    kGramCount,
    windowCount,
  })?.filter((data) =>
    fingerPrintHandler({
      str: strJudulPenelitian,
      kGramCount,
      windowCount,
    })?.includes(data)
  );

  return (
    (sameArr?.length /
      fingerPrintHandler({ str: strJudulMhs, kGramCount, windowCount })
        ?.length) *
    (100 / 100)
  );
};

// // console.log(arrRollingHashHandler(strTest, 7));
// // console.log(windowHandler(strTest, 5, 2));
// // console.log(windowHandler(strTest2, 5, 2));
// // console.log(arrKGramHandler(strTest, 5));
// // console.log(rollingHashEachHandler("siste"));
// // console.log(rollingHashHandler("de"));

// /**
//  * Judul penelitian seorang dosen banyak, jadi disimpan dalam array saja
//  */

const winnowingHandler = ({
  strJudulMhs,
  arrJudulDosen = [],
  kGramCount,
  windowCount,
}) => {
  const arrValueK1 = [];
  arrJudulDosen?.forEach((judulDosen) => {
    arrValueK1?.push(
      roundUp4(
        jaccardSimilarityHandler({
          strJudulMhs: preProcessingText(strJudulMhs),
          strJudulPenelitian: preProcessingText(judulDosen),
          kGramCount,
          windowCount,
        })
      )
    );
  });
  /**
   * Hasil winnowing terhadap semua judul penelitian dosen, dijumlahkan semuanya sebagai value untuk K1
   */
  return arrValueK1?.reduce((total, curr) => {
    return (total += curr);
  }, 0);
};
// // ---------------End---------------

const strJudulMahasiswa =
  "PENENTUAN DOSEN PEMBIMBING TUGAS AKHIR JURUSAN TI POLITEKNIK NEGERI PADANG DENGAN ALGORITMA AHP-WP DAN WINNOWING BERBASIS WEBSITE";
const arrPenelitianDosenDwiny = [
  "Hybrid of AHP and TOPSIS for loan approval decision",
  "Sistem Pendukung Keputusan Memilih Tiket Pesawat Dengan Menggunakan Metode AHP",
  "Perancangan Website untuk Menentukan Produk Paling Banyak Terjual di Bengkel Man Motor Metode TOPSIS",
];
const arrPenelitianDosenAlde = [
  "Sistem Informasi Harga Komoditas Pangan untuk Pasar-Pasar di Kota Padang",
  "The Implementation of IoT (Internet of Things) for Controlling Cow Health",
  "Web Application Penetration Testing Using SQL Injection Attack",
];
const arrPenelitianDosenRoni = [
  "E-Logbook Laporkan Kondisi Kesehatan, Absen & Kinerja Dosen, Kependidikan dan Kontrak selama WFH",
  "Financial Statements Analysis of Tanah Datar District Government",
  "Perancangan Sistim Monitoring Parkir Mobil Berbasis Web",
];
const arrPenelitianDosenDefni = [
  "Enkripsi SMS (Short Message Service) pada telepon selular berbasis Android dengan metode RC6",
  "Pemanfaatan Metode Kano Untuk Menilai Tingkat Kepuasan Pengguna Terhadap Fungsionalitas Sistem Informasi Kepegawaian (Studi Kasus: AKNP Pelalawan)",
  "Analisis Sistim Informasi Akademik Berbasis Web Menggunakan Model Kano",
];

console.log(
  winnowingHandler({
    strJudulMhs: strJudulMahasiswa,
    // arrJudulDosen: arrPenelitianDosenAlde,
    // arrJudulDosen: arrPenelitianDosenRoni,
    arrJudulDosen: arrPenelitianDosenDefni,
    kGramCount: 3,
    windowCount: 5,
  })
);
