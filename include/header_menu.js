var menuLi = document.querySelectorAll('.menu ul li a');
menuLiEvent();
function menuLiEvent() {
    for(var i = 0; i < menuLi.length; i++) {
        menuLi[i].onmouseover = function() {
            doSomeThing(this.getAttribute('class'), 'show-menu');
        }
        menuLi[i].onmouseout = function () {
            doSomeThing(this.getAttribute('class'), '');
        }
    }
    function doSomeThing(parent, value){
        var childSelect = document.querySelector('.'+parent+'-child-menu');
        if (childSelect) {
            var cla = childSelect.getAttribute('class');
            if (cla.indexOf('active') <= -1) {
                childSelect.setAttribute('id', value);
            }
        }
    }
}
function goSearch () {
    var searchValue = document.getElementById("search-value").value;
    if(searchValue){
        window.location.href="/meitu/search/"+searchValue.replace(/_/g,"&&")+"/";
    };
};
function getKeyup (e) {
    var event=e||window.event;
    if(event.keyCode=="13"){
        goSearch();
    }
}
