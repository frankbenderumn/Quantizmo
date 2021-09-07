$(document).ready(function(){
    var taggableTab = 0;
    $("[data-role=trigger]").on('click', function(){
      $("[data-role=extend]").each(function(){
        $(this).height(0);
        $(this).hide();
      });
      let id = $(this).attr('data-unique').toString();
      $(`[data-role="show"][data-unique="${id}"]`).toggle();
      $(`[data-role="target"][data-unique="${id}"]`).toggle();
      $(`[data-role="modal"][data-unique="${id}"]`).show();
      $(`[data-role="extend"][data-unique="${id}"]`).show().animate({height: '400px'});
      if($(this).attr('data-unique') == 'approve-image'){
        $("[data-unique=approve-image][data-role=modal] .slim.modal-box #pending-image").html('');
        $("[data-role=modal]").each(function(){
          $(this).hide();
        });
        let number = $(this).attr('data-number');
        $("[data-role=modal][data-unique=approve-image]").show();
        let image = $(`[data-role=trigger][data-unique=approve-image][data-number='${number}'] img`).clone();
        image.css('width', '100%');
        image.css('height', 'auto');
        $("[data-unique=approve-image][data-role=modal] .slim.modal-box #pending-image").prepend(image);
        let url = image.attr('src');
        $("[data-role=select][data-unique=messenger-background-image]").attr('data-selected', `${url}`);
      }
    });
  
    $("[data-role=select]").click(function(){
      let url = $(this).attr('data-selected');
      let id = $(this).attr('data-unique');
      $(`[data-field='${id}']`).val(url);
      console.log($(`[data-field='${id}']`).val());
    });
    $("[data-role=upload]").click(function(){
      console.log("upload clicked!");
      let id = $(this).attr('data-unique');
      $(`[data-field='${id}']`).click();
    });
    $("[data-trigger][data-role=toggle]").on('click', function(){
      $("[data-target][data-role=toggle]").each(function(){
        $(this).hide();
      });
      let target = $(this).attr('data-trigger');
      $(`[data-target='${target}']`).show();
    });
    if($(".slim.modal:visible")){
      $(window).on('click', function(e){
        if($(e.target).is(".slim.modal")){
          $(".slim.modal").each(function(){
            $(this).hide();
          });
        }
      });
    }
    var alert;
    $.fn.alert = (type, message) => {
      switch(type){
        case 'success':
        $("div#alerts").append(`<span class='alert alert-success'><span class='alert-header'><i class='fas fa-star'></i></span><span class='alert-body'>${message}</span></span>`);
        break;
        case 'danger':
        $("div#alerts").append(`<span class='alert alert-danger'><span class='alert-header'><i class='fas fa-star'></i></span><span class='alert-body'>${message}</span></span>`);
        break;
        case 'warning':
        $("div#alerts").append(`<span class='alert alert-warning'><span class='alert-header'><i class='fas fa-star'></i></span><span class='alert-body'>${message}</span></span>`);
        break;
        case 'notice':
        $("div#alerts").append(`<span class='alert alert-notice'><span class='alert-header'><i class='fas fa-star'></i></span><span class='alert-body'>${message}</span></span>`);
        break;
        default:
        break;
      }
      $(".alert").delay(400).fadeOut(2000);
    };
  });

  $(document).ready(function(){

    $("#sidenav-close").on('click', function(){
      var x = document.getElementById('sidenav');
      x.style.width = '0';
    });
    $("#sidenav-offline-close").on('click', function(){
      var x = document.getElementById('sidenav-offline');
      x.style.width = '0';
    });
    $("#sidenav-trigger").on('click', function(){
      var x = document.getElementById('sidenav');
      console.log('jQuery is going through!');
      x.style.width = '250px';
    });
    $("#sidenav-offline-trigger").on('click', function(){
      var x = document.getElementById('sidenav-offline');
      console.log('jQuery is going through!');
      x.style.width = '250px';
    });
  
    // JAVASCRIPT MODALS
    const modals = document.querySelectorAll('.modal');
    const btn = document.querySelectorAll(".modal-button");
    console.log(`btn array is ${btn}`);
    // SHOULD CHANGE TO MODAL CLOSE
    const spans = document.getElementsByClassName("close");
    for (let i = 0; i < btn.length; i++) {
      btn[i].onclick = function(e) {
        e.preventDefault();
        console.log(`modal array is:`);
        console.log(modals);
        let modal = document.querySelector(e.target.getAttribute("href"));
        console.log(`modal is: `);
        console.log(modal);
        modal.style.display = "block";
      }
    }
    for (let i = 0; i < spans.length; i++) {
      spans[i].onclick = function() {
        for (let index in modals) {
          if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";
        }
      }
    }
    for (let i = 0; i < spans.length; i++) {
      spans[i].onclick = function() {
        for (let index in modals) {
          if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";
        }
      }
    }
    for (let i = 0; i < modals.length; i++){
      modals[i].onclick = function(e){
        for (let index in modals) {
          if (e.target.classList.contains('modal')) modals[index].style.display = "none";
        }
      }
    }
  
  });
  
  
  // HEADER JS
      