var product = {
  is_advance_search: false,
  
  initialize: function () {
    if (utils.url_param('search_params[term]')) {
      $('#tf-search-product').val(utils.url_param('search_params[term]'));
    }
    $('#btn-create-product').click(function () {
      $('#md-create-product').modal();
    });
    $('#btn-advance-search').click(function () {
      if (product.is_advance_search == false) {
        $('#content-advance-search').css('display', 'block');
        product.is_advance_search = true;
      } else {
        $('#content-advance-search').css('display', 'none');
        product.is_advance_search = false;
      }
    });
    $('#btn-search-product').click(function (event) {
      event.preventDefault();
      product.search_product();
    });
    $('.category_product').each(function () {
      $(this).select2({
        theme: 'bootstrap'
      });
    });
    $('.manufacturer_select').each(function () {
      $(this).select2({
        theme: 'bootstrap'
      });
    });
    $('#btn-add-spec').click(function (event) {
      event.preventDefault();
      product.on_click_add_specification();
    });
    $('#btn-create').click(function (event) {
      event.preventDefault();
      product.create_product();
    });
    $('.btn-delete-spec').each(function () {
      $(this).on('click', function (event) {
        event.preventDefault();
        if ($('.btn-delete-spec').length == 2) {
          alert(I18n.t('js.product.message_min_field'));
          return;
        }
        $(this).parent().parent().remove();
      });
    });
    utils.on_check_delete('cb-delete-product', 'cb-all-product');
    $('#category_search').select2({
      theme: 'bootstrap'
    });
    $('#manufacturer_search').select2({
      theme: 'bootstrap'
    });
  },
  
  on_click_add_specification: function () {
    $('#content-spec').append($('#field-spec-create').html());
  },
  
  create_product: function () {
    var product = {};
    product.name = $('#name').val();
    if (product.name == '') {
      alert(I18n.t('js.product.message_blank_name'));
      return;
    }
    if ($('#price').val() == '') {
      alert(I18n.t('js.product.message_blank_price'));
      return;
    }
    product.price = parseFloat($('#price').val());
    if (isNaN(product.price)) {
      alert(I18n.t('js.product.message_price'));
      return;
    }
    product.category_id = $('#category_product').val();
    product.manufacturer_id = $('#manufacturer_select').val();
    var specifications = [];
    var spec_name = $('input[name=spec-name]');
    var spec_value = $('input[name=spec-value]');
    for (var i = 0; i < $(spec_name).length - 1; i++) {
      var name = $(spec_name[i]).val();
      var value = $(spec_value[i]).val();
      if (name == '' || value == '') {
        alert(I18n.t('js.product.message_blank_field'));
        return;
      }
      var specification = {
        name: name,
        value: value
      };
      specifications.push(specification);
    }
    product.specifications = specifications;
    $.post(I18n.t('js.url_admin_product'), {product: product},
      function (data, status) {
        try {
          jQuery.parseJSON(data);
          alert(data);
        } catch (err) {
          for (var i = 0; i < $(spec_value).length - 1; i++) {
            $(spec_value[i]).val('');
          }
          if (!$('#cb_keep_save').is(':checked')) {
            $('#md-create-product').modal('hide');
          }
          $('#content-products').prepend(data);
        }
      }, 'html');
  },
  
  search_product: function () {
    var search_params = {};
    search_params.term = $('#tf-search-product').val();
    if (product.is_advance_search) {
      if ($('#category_search').val() != '') {
        search_params.category_id = $('#category_search').val();
      }
      if ($('#manufacturer_search').val() != '') {
        search_params.manufacturer_id = $('#manufacturer_search').val();
      }
      if ($('#min-price-search').val() != '') {
        search_params.min_price = parseFloat($('#min-price-search').val());
        if (isNaN(search_params.min_price)) {
          alert(I18n.t('js.product.message_price'));
          return;
        }
        if (search_params.min_price < 0) {
          alert(I18n.t('js.product.message_min_price'));
          return;
        }
      }
      if ($('#max-price-search').val() != '') {
        search_params.max_price = parseFloat($('#max-price-search').val());
        if (isNaN(search_params.max_price)) {
          alert(I18n.t('js.product.message_price'));
          return;
        }
        if (search_params.max_price < 0) {
          alert(I18n.t('js.product.message_max_price'));
          return;
        }
      }
      if (!isNaN(search_params.max_price) && !isNaN(search_params.min_price)
        && search_params.max_price < search_params.min_price) {
        alert(I18n.t('js.product.message_min_max_price'));
        return;
      }
    }
    $.get(I18n.t('js.url_admin_product'),
      {search_params: search_params},
      function (data, status) {
        $('#list-product').html(data);
      }, 'html');
  }
};
