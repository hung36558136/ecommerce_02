var manufacturer = {
  initialize: function (){
    $('.btn-add-manu').on('click', function(event){
      event.preventDefault();
      $("#manu-modal").modal();
    });

    $(".btn-view-manu").each(function(){
      $(this).on('click', function(event){
        event.preventDefault();
        var id = $(this).attr('id');
        $("#manu-modal-"+id).modal();
      });
    });
  }
}
