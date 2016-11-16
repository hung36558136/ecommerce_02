var utils = {
  on_check_delete: function (cb_name, cb_all_id) {
    var cb_delete = $('input[name=' + cb_name + ']');
    var cb_all = $('#' + cb_all_id);
    cb_delete.each(function () {
      $(this).on('change', function () {
        if (!$(this).is(':checked')) {
          cb_all.prop('checked', false);
        } else {
          var check_all = true;
          cb_delete.each(function () {
            if (!$(this).is(':checked')) {
              check_all = false;
              return false;
            }
          });
          if (check_all) {
            cb_all.prop('checked', true);
          }
        }
      });
    });
    cb_all.change(function () {
      if ($(this).is(':checked')) {
        cb_delete.each(function () {
          $(this).prop('checked', true);
        });
      } else {
        cb_delete.each(function () {
          $(this).prop('checked', false);
        });
      }
    })
  },
  
  url_param: function (name, url) {
    if (!url) {
      url = window.location.href;
    }
    url = decodeURIComponent(url);
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      if (hash[0] == name) {
        return hash[1];
      }
    }
    return "";
  },
  
  get_path: function () {
    return location.href.split('?')[0];
  }
};
