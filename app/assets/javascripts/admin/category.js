var category = {
  initialize: function () {
    $('#btn-create-category').click(function (event) {
      event.preventDefault();
      category.show_create_category_modal();
    });
    $('#category_select').select2({
      theme: 'bootstrap'
    });
    $('#btn-save').click(function (event) {
      event.preventDefault();
      category.save_category();
    });
    $('#btn-search-category').click(function (event) {
      event.preventDefault();
      category.search_category();
    });
    $('.show_sub_category').each(function () {
      category.show_sub_category($(this));
    });
    if (typeof ($('#notice').html()) !== 'undefined'
      && $('#notice').html() !== '') {
      alert($('#notice').html());
    }
  },
  
  show_create_category_modal: function () {
    $('#md-create-category').modal();
  },
  
  save_category: function () {
    var category = {
      parent_id: $('#category_select').val(),
      name: $('#name').val()
    };
    if (category.name === '') {
      alert(I18n.t('js.category.notice_blank'));
      return;
    }
    $.post(I18n.t('js.url_admin_category'),
      {category: category},
      function (data, status) {
        if (data === 'false') {
          alert(I18n.t('js.category.save_fail'));
        } else {
          location.reload();
        }
      }, 'html');
  },
  
  search_category: function () {
    $.get(I18n.t('js.url_admin_category'),
      {q: $('#tf-search-category').val()},
      function (data, status) {
        $('#list-category').html(data);
        $('.sub_category').css('display', 'block');
        $('.show_sub_category').each(function () {
          category.show_sub_category($(this));
        });
      }, 'html');
  },
  
  show_sub_category: function (obj) {
    $(obj).hover(function () {
      $(obj).css('cursor', 'pointer');
    });
    $(obj).on('click', function (event) {
      event.preventDefault();
      var id = $(this).attr('id');
      if ($('#sub_category_' + id).css('display') === 'none') {
        $('#sub_category_' + id).css('display', 'block');
      } else {
        $('#sub_category_' + id).css('display', 'none');
      }
    });
  }
};

category.initialize();
