
function scaleCaptcha(elementWidth) {
    // Width of the reCAPTCHA element, in pixels
    var reCaptchaWidth = 304;
    // Get the containing element's width
      var containerWidth = $('.container').width();
    
    // Only scale the reCAPTCHA if it won't fit
    // inside the container
    if(reCaptchaWidth > containerWidth) {
      // Calculate the scale
      var captchaScale = containerWidth / reCaptchaWidth;
      // Apply the transformation
      $('.g-recaptcha').css({
        'transform':'scale('+captchaScale+')'
      });

    }
  }
  
  $(() => {
    
    $("#cookieChoiceDismiss").css("color","black");

    // Initialize scaling
    scaleCaptcha();

    // Update scaling on window resize
    // Uses jQuery throttle plugin to limit strain on the browser
     $(window).resize( $.throttle( 100, scaleCaptcha ) );
    $(".li_navbar").removeClass("active");
    var href = document.location.href;
    var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);
    var idNameNavbar = lastPathSegment+"_navbar";
    var idNameNavbarMenu = idNameNavbar+"_menu";
    console.log(idNameNavbar);
    console.log(idNameNavbarMenu);

    $("#"+idNameNavbar).addClass("active");
    $("#"+idNameNavbarMenu).addClass("active");
});
