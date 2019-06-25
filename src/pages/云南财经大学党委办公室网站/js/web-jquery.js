$(function(){
	$('#banner div.banner_img').append('<div class="banner_an"><ul></ul></div>')
	$('#banner div.banner_img').append('<div class="banner_lie"></div>')
	var banner_len=$('#banner div.banner_img>ul li').length;
	var banner_i=0;
	var banner_time=setInterval(banner_play,5000);
	for(var i=0 ; i<banner_len ; i++){
		$('#banner div.banner_an ul').append('<li></li>')
	}

	$('#banner div.banner_an ul li').eq(banner_i).addClass('active');

	function banner_play(){
		if(banner_i<banner_len-1){
			banner_i++;
			banner_animate();
		}else{
			banner_i=0;
			banner_animate();
		}
	}

	function banner_animate(){
		if($('#banner div.banner_img>ul').is(":animated")){
			$('#banner div.banner_img>ul').stop(true,true);
		}
	

		$('#banner div.banner_img>ul').animate({
			"left":(-1)*banner_i*600
		})

		$('#banner div.banner_an ul li').removeClass('active');
		$('#banner div.banner_an ul li').eq(banner_i).addClass('active')
	}

	$('#banner div.banner_an ul li').mouseover(function(){
		banner_i=$('#banner div.banner_an ul li').index(this);
		banner_animate();
	})

	$('#banner').hover(function(){
		clearInterval(banner_time)
	},function(){
		banner_time=setInterval(banner_play,5000);
	})



	  //友情链接
  $('.footer_right>div').hover(function(){
    $(this).find('ul').show()
  },function(){
    $(this).find('ul').hide()
  })

  //对联位置计算

  function dl_auto(){
  	var w_width=$(window).width();
	  var dl_jl=(w_width-1200)/2-95
	  $('.dl_left').css({
	  	"left":dl_jl
	  })

	  $('.dl_right').css({
	  	"right":dl_jl
	  })

	  if(w_width<1360){
	  	 $('.dl_left').hide();
	  	 $('.dl_right').hide();
	  }else{
	  	 $('.dl_left').show();
	  	 $('.dl_right').show();
	  }

  }dl_auto()

  $(window).resize(dl_auto)


})