import DataService from "./dataService.js";

export function adminDOM(state,id,status) {
    return `${state.is_super_user?`
        <div class="card-header d-flex justify-content-between">
            <select id="admin_change_status_${id}" >
                <option value="new">new</option>
                <option value="planned">planned</option>
                <option value="done">done</option>
            </select>
            <div class="input-group ml-2 mr-5 ${(status !== 'done')?'d-none':''}" id="admin_video_res_container_${id}">
                <input type="text" id="admin_video_res_${id}" class="form-control" placeholder="paste here youtube video id">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" id="admin_save_video_res_${id}" type="button">Save</button>
                </div>
            </div>
            <button id="admin_delete_video_req_${id}" class='btn btn-danger'>delete</button>
        </div>
`:''}`;
}




export function bindAdminActions(state,vidInfo) {
    const {_id:id,status,topic_title:title,video_ref} = vidInfo;
// ,video_ref,status,id,title
    const adminChangeStatusElm = document.getElementById(`admin_change_status_${id}`);
    const adminVideoResElm = document.getElementById(`admin_video_res_${id}`);
    const adminSaveVideoResElm = document.getElementById(`admin_save_video_res_${id}`);
    const adminDeleteVideoReqElm = document.getElementById(`admin_delete_video_req_${id}`);
    const adminVidResContainerElm = document.getElementById(`admin_video_res_container_${id}`);

    if(state.is_super_user){
        adminChangeStatusElm.value = status;
        adminVideoResElm.value = video_ref.link;
        // on change status
        adminChangeStatusElm.addEventListener('change',function (e) {
            const videoStatus = e.target.value;
            if(videoStatus === 'done'){
                adminVidResContainerElm.classList.remove('d-none');
            }else{
                DataService.updateVideoStatus(id,videoStatus);
            }
        });

        // on send video status
        adminSaveVideoResElm.addEventListener('click',function (e) {
            e.preventDefault();
            if(!adminVideoResElm.value){
                adminVideoResElm.classList.add('is-invalid');
                adminVideoResElm.addEventListener('input',function(){
                    this.classList.remove('is-invalid');
                });
                return;
            }
            DataService.updateVideoStatus(id,'done',adminVideoResElm.value);
        });

        // on delete
        adminDeleteVideoReqElm.addEventListener('click',function (e) {
            const vidContainerElm = document.getElementById(`vidContainer${id}`);
            e.preventDefault();
            const isSure = confirm(`Are you sure you want to delete "${title}"`);
            if(!isSure)
                return;
            // delete
            return DataService.deleteVideoReq(vidInfo,vidContainerElm);
        });
    }
}