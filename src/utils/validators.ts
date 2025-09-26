export const isNonEmpty = (v:string)=> v.trim().length>0;
export const isEmail = (v:string)=> /.+@.+\..+/.test(v);
export const isPhoneID = (v:string)=> /^\+?62\d{8,13}$/.test(v.replace(/^0/, "+62"));
export const notPastDate = (iso:string)=> new Date(iso).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0);