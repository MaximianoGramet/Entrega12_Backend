export const chatBlock = (req,res)=>{
    if(req.session.user.rol === 'admin'){
        res.render('denied')
    }
    else{
        res.render('chat',{})
    }
}