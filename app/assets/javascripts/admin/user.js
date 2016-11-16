var user = {
  initialize: function (){
    $(".btn-view-user").each(function(){
      $(this).on('click', function(event){
        event.preventDefault();
        var id = $(this).attr('id');
        $("#user-modal-"+id).modal();
      });
    });
  }
}
