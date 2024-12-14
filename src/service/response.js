export const SendCreate = (res,message,data)=>{ 
    res.status(201).json({success: true,message,data}) // create 201
}
export const SendSuccess = (res,message,data)=>{ 
    res.status(200).json({success: true,message,data}) // ສະແດງ ຂໍ້ມູນ
}
export const SendError = (res,status,message,error)=>{
  res.status(status).json({success: false,message,error}) // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
}