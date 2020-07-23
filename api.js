const apiUrl = 'http://localhost:7777';
export default {
    videoReq:{
        get:(sortBy,searchTerm,filterBy)=>{
            return fetch(`${apiUrl}/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}&filterBy=${filterBy}`)
                .then(blob=>blob.json())
        },
        post:(formData)=>{
            return fetch(`${apiUrl}/video-request`,{
                method:'POST',
                body:formData
            }).then((bold)=>bold.json());
        },
        update:(VideoId,status,videoResValue)=>{
            return fetch(`${apiUrl}/video-request`,{
                method:'put',
                headers:{'content-Type':'application/json'},
                body:JSON.stringify({id:VideoId,status:status,resVideo:videoResValue})
            }).then(res=>res.json());
        },
        delete:(vidInfo)=>{
            return fetch(`${apiUrl}/video-request`,{
                method:'delete',
                headers:{'content-Type':'application/json'},
                body:JSON.stringify({id:vidInfo._id})
            }).then(res=>res.json())

        },
    },
    votes:{
        update:(req_id,vote_type,state)=>{
            console.log(req_id,vote_type,state.userId);
            return fetch(`${apiUrl}/video-request/vote`,{
                method:'put',
                headers:{'content-Type':'application/json'},
                body:JSON.stringify({id:req_id,vote_type:vote_type,user_id:state.userId})
            }).then((bolb)=>bolb.json())
        }
    }
}