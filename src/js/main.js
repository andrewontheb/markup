$(document).ready(function() {
  var header = $('header');
  var burger = $('.nav-toggle');

  function initStickyCart() {
    var st = $(window).scrollTop();
    var ot = header.offset().top;
    if(st > ot) {
      header.addClass('sticky');
    }
    if(st < 40) {
      header.removeClass('sticky');
    }
  }

  

  $(window).scroll(initStickyCart);

  var cont = $('#btn-filter').html();
  $('#btn-filter').click(function() {
    if($('.filter-list').is(':hidden')) {
      $('.filter-list').show('fast');
      $('.price-range-group').show();
      $(this).html('Скрыть');
    } else {
      $(this).html(cont);
      $('.filter-list').hide();
      $('.price-range-group').hide();
    }
  })

  burger.click(function() {
    $(this).toggleClass('opened');
    $('header').toggleClass('opened');
  });

  $('.filter--additional li').not('.filter-list__item--title').hide();

  $('.filter--additional .filter-list__item--title').click(function() {
    if($(this).closest('ul').hasClass('closed')) {
      $(this).closest('ul').find('*').fadeIn();
    } else {
      $(this).closest('ul').find('li').not('.filter-list__item--title').fadeOut();
    }

    $(this).closest('ul').toggleClass('opened');
    $(this).closest('ul').toggleClass('closed');
  })

  $('.slick-slider').slick({
    dots: true,
    autoplay: false,
    arrows: true,
    draggable: false,
    fade: false,
    infinite: true,
    // mobileFirst: true,
    respondTo: 'window',
    // width: '960px',
    responsive: [{

      breakpoint: 969,
      settings: {
        dots: false
        // width: '921px',
        // autoplay: true,
        // autoplaySpeed: 5000
      }
    },
    {
      breakpoint: 480,
      settings: 'unslick'
    }],
    appendDots: $('.product-slider__dots'),
    customPaging : function(slider, i) {
      return '<div class="slick-slider__dot"></div><div class="slick-slider__dot slick-slider__dot--active"></div></a>';
    },
  });
})
