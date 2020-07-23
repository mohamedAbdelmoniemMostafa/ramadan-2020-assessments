import {applyVoteStyle} from "./applyVoteStyle.js";
import DataService from './dataService.js';
import {adminDOM,bindAdminActions} from './admin_temp_actions.js'
const listOfVidElm = document.getElementById('listOfRequests');
function dateFormat(date) {
   return new Date(date).toLocaleDateString();
}

function voteActions(state,vidInfo,id) {
    const scoreVoteElm = document.getElementById(`score_vote_${id}`);
    const votesElms = document.querySelectorAll(`[id^=votes_][id$=_${id}]`);
    //  voting
    votesElms.forEach(elm=>{
        if(state.is_super_user || status === 'done')
            return;
        elm.addEventListener('click',function (e) {
            e.preventDefault();
            const [,vote_type,req_id] = e.target.getAttribute('id').split('_');
            // votes
            DataService.updateVotes(req_id,vote_type,state,scoreVoteElm,vidInfo);

        });
    });
}

// video template
export function renderSingleVidReq(vidInfo,state,isPrepend=false){
    const {_id:id,status,topic_title:title,topic_details:details,expected_result:expected,
            video_ref,votes,author_name:author,submit_date,target_level:level} = vidInfo;
    const statusClass = status === 'done'?'text-success':status === 'planned'?'text-info':'';
    const voteScore = votes.ups.length - votes.downs.length;
    const vidReqContainerElm = document.createElement('div');
    vidReqContainerElm.innerHTML =  `
        <div class="card mb-3" id="vidContainer${id}">
        
        ${adminDOM(state,id,status)}
        
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>${title}</h3>
              <p class="text-muted mb-2">${details}</p>
              <p class="mb-0 text-muted">
                ${expected && `<strong>Expected results:</strong> ${expected}`}
              </p>
            </div>
            ${status === 'done'?`<div class="ml-auto mr-3">
                <iframe width="240" height="135"
                  src="https://www.youtube.com/embed/${video_ref.link}"
                  frameborder="0" allowfullscreen></iframe>
             </div>`:''}
            
            <div class="d-flex flex-column text-center">
              <a id="votes_ups_${id}" class="btn btn-link" data-value="ups">🔺</a>
              <h3 id="score_vote_${id}">${voteScore}</h3>
              <a id="votes_downs_${id}" class="btn btn-link" data-value="downs">🔻</a>
            </div>
          </div>
          
          <div class="card-footer d-flex flex-row justify-content-between">
            <div class="${statusClass}">
                <span id="vidStatus_${id}">
                    ${status.toUpperCase()} 
                    ${status === 'done'?`on ${dateFormat(video_ref.date)}`:''}
                </span>
              &bullet; added by <strong>${author}</strong> on
              <strong>${dateFormat(submit_date)}</strong>
            </div>
            
            <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
              <div class="badge badge-success">
                ${level}
              </div>
            </div>
            
          </div>
          
        </div>
`;
    if(isPrepend){
        listOfVidElm.prepend(vidReqContainerElm);
    }else{
        listOfVidElm.appendChild(vidReqContainerElm);
    }
    bindAdminActions(state,vidInfo);

    applyVoteStyle(vidInfo,votes,status==='done',state);


    voteActions(state,vidInfo,id)

}