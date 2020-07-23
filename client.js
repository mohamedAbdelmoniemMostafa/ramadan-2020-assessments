import {debounce} from './debounce.js';
import {renderSingleVidReq} from './videoTemplate.js';
import DataService from './dataService.js';
import {checkValidity} from './checkValidity.js';


const super_user_id = '19900411';
export const state={
    sortBy:'newFirst',
    searchTerm:'',
    userId:'',
    is_super_user:false,
    filterBy:'all'
};

document.addEventListener('DOMContentLoaded',function () {
    const formVidReqElm = document.getElementById('formVideoRequest')
    const sortByElms = document.querySelectorAll('[id*=sort_by_]');
    const searchBoxElm = document.getElementById('search_box');
    const formLoginElm = document.querySelector('.form-login');
    const appContentElm = document.querySelector('.app-content');
    const filterByElms = document.querySelectorAll('[id^=filter_by_]');

    if(window.location.search){
        state.userId = new URLSearchParams(window.location.search).get('id');
        if(state.userId ===  super_user_id){
            state.is_super_user = true;
            document.querySelector('.normal-user-content').classList.add('d-none');
        }
        formLoginElm.classList.add('d-none');
        appContentElm.classList.remove('d-none');
    }
    // render template
    DataService.loadAllVidReqs();
    filterByElms.forEach(elm=>{
       elm.addEventListener('click',function (e) {
           e.preventDefault();
           state.filterBy = e.target.getAttribute('id').split('_')[2];
           filterByElms.forEach(option=>option.classList.remove('active'));
           this.classList.add('active');
           DataService.loadAllVidReqs(state.sortBy,state.searchTerm,state.filterBy);
       });
    });
    // sort by rendering
    sortByElms.forEach(elm=>{
        elm.addEventListener('click',function (e){
            e.preventDefault();
            state.sortBy = this.querySelector('input').value;
            DataService.loadAllVidReqs(state.sortBy,state.searchTerm,state.filterBy);
            this.classList.add('active');
            if(state.sortBy === 'topVotedFirst'){
                document.getElementById('sort_by_new').classList.remove('active');
            }else{
                document.getElementById('sort_by_top').classList.remove('active');
            }
        })
    });
    // search box
    searchBoxElm.addEventListener('input',debounce((e)=>{
        state.searchTerm = e.target.value;
        DataService.loadAllVidReqs(state.sortBy,state.searchTerm,state.filterBy);
    },700));
    // submit video
    formVidReqElm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const formData = new FormData(formVidReqElm);
        formData.append('author_id',state.userId);
        const isValid = checkValidity(formData);
        if(!isValid)return;

        DataService.addVideoReq(formData).then((data)=>{
                const inputs = document.getElementById('formVideoRequest').querySelectorAll('.form-control');
                inputs.forEach((elm)=>{
                    elm.value='';
                });
                // console.log(data);
                renderSingleVidReq(data,state,true);
            })
    });
});