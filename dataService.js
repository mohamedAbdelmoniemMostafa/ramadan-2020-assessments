import {renderSingleVidReq} from './videoTemplate.js';
import {state} from "./client.js";
import API from './api.js';
import {applyVoteStyle} from "./applyVoteStyle.js";

export default {
    // add
    addVideoReq:(formDate)=>{
        return API.videoReq.post(formDate);
    },
    //delete
    deleteVideoReq:(vidInfo,vidContainerElm)=>{
       return API.videoReq.delete(vidInfo).then(data=>{
           vidContainerElm.remove();
       });
    },
    // update status
    updateVideoStatus:(VideoId,status,videoResValue='')=>{
        const vidStatusElm = document.getElementById(`vidStatus_${VideoId}`);
        API.videoReq.update(VideoId,status,videoResValue='').then(data=>{
                vidStatusElm.innerText = data.status.toUpperCase();
                if(data.status === 'done'){
                    vidStatusElm.parentElement.classList.remove(vidStatusElm.parentElement.classList[0]);
                    vidStatusElm.parentElement.classList.add('text-success');
                }else if(data.status === 'planned'){
                    vidStatusElm.parentElement.classList.remove(vidStatusElm.parentElement.classList[0]);
                    vidStatusElm.parentElement.classList.add('text-info');
                }else{
                    vidStatusElm.parentElement.classList.remove(vidStatusElm.parentElement.classList[0]);
                }

            });
    },

    // load videos request
    loadAllVidReqs:(sortBy='newFirst',searchTerm='',filterBy='all',localState=state)=>{
        const listOfVidElm = document.getElementById('listOfRequests');
        API.videoReq.get(sortBy,searchTerm,filterBy).then(data=>{
                listOfVidElm.innerHTML = '';
                data.forEach((vidInfo)=>{
                    renderSingleVidReq(vidInfo,localState);

                })
            });
    },

    // vote
    updateVotes:(req_id,vote_type,state,scoreVoteElm,vidInfo)=>{
        return API.votes.update(req_id,vote_type,state).then((data)=>{
            scoreVoteElm.innerText = data.ups.length - data.downs.length;
            applyVoteStyle(vidInfo,data,vidInfo.status === 'done',state,vote_type);
        });
    }
}