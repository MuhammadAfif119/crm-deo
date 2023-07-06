//format number

// format ini untuk semua price rates, tinggal ditambahkan currency nya Ex : Rp. $. DLL
export function formatFrice(value) {
    if (typeof value === 'number') {
      if (value < 1000) {
        let val = value.toFixed(2);
        if (val === '0.00') {
          val = '0';
        } else {
          val = parseFloat(val).toString();
        }
        return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    } else {
      return "0";
    }
  }




  

//format IDR
//format USD
