import moment from "moment";

export const dateFormat=(date:Date | null)=>{
  if(date) {
    return moment(date).format("yyyy-MM-DD HH:mm:ss").toString();
  }
  return null;
}