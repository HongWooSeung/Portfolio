$(window).on('beforeunload', function() {
    // 새로고침 직전에 스크롤 위치를 맨 위로 초기화
    $(window).scrollTop(0);
});

$(document).ready(function(){
	
	//모달 열고 닫는 스크립트
	
	//열기
	$pages = $("body");
	let modal_page = 0; //현재 모달 페이지(안보이면 0)
	
	$("section").each(function(i){
		$(this).find(".modal-open").each(function(){
			$(this).on("click",function(){
				$(".Modal-wrap").show();
				const $target = $pages.find('.modal-content').eq(i).addClass('modal_active');
				modal_page = i+1;
				moveY = 0;
				bgScrollVal = 0;
				$target.css({
						'background-position-y': 0 + 'px' // 단위 꼭 붙임
					});
			});
		});
	});
	
	//닫기
	$(".modal-close").on("click", function(){
		$(".Modal-wrap").hide();
		const $target = $pages.find('.modal-content').removeClass('modal_active');
		modal_page = 0;
	});
	
	$(".modal-back").on("click", function(){
		$(".Modal-wrap").hide();
		const $target = $pages.find('.modal-content').removeClass('modal_active');
		modal_page = 0;
	});
	
	//모달 열고 닫는 스크립트 끝

    // 페이지 로드 시 wrap의 위치를 첫 번째 섹션으로 초기화
    $(".wrap").css("transform", "translateY(0)");
    
    // 브라우저의 기본 스크롤 복원 기능 끄기 (가장 중요)
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
	
	//원스크롤
	// 변수명 통일: .wrap을 가리키는 $wrap
    const $wrap = $('.wrap'); 
    
    let currentPage = 0;
    let offsetArray = [];
    let isScrolling = false;

    // 1. 개발자님의 논리: 남은 높이를 계산해 이동 지점을 제한하는 함수
    function setPosition() {
        offsetArray = [];
        const winHeight = $(window).height();
        const wrapHeight = $wrap.outerHeight(); // 전체 wrap의 높이
        const $eachPages = $wrap.find('.pages');
		const finalTop = wrapHeight - winHeight;
        
        $eachPages.each(function(i) {
            const currentTop = $(this).offset().top;
            // [중요 로직] 남은 높이가 화면 높이보다 작으면 바닥에 도달한 것
            const remainingHeight = wrapHeight - currentTop;
			
            if (remainingHeight <= winHeight) {
                // 더 내려가면 공백이 보이므로, '전체높이 - 화면높이'를 마지막 좌표로 고정
                offsetArray.push(finalTop);
                
                // 더 이상의 페이지 인덱스는 의미 없으므로 여기서 중단 (return false)
                return false; 
            } else {
                // 아직 내려갈 공간이 충분하면 해당 페이지의 top을 저장
                offsetArray.push(currentTop);
            }
        });
    }
	
	//모달 부분
	let bgScrollVal = 0; // 실제 스크롤 대신 사용할 가상의 스크롤 변수
	let moveY = 0;
	
	function scrollModal(e) {
		if (modal_page != 0) {
			const $target = $pages.find('.modal-content').eq(modal_page-1);
			const win_height = $(window).height();
			const modal_height = $target.outerHeight(); // 전체 wrap의 높이
			const bottom_height = parseInt($('.Modal-wrap #modal').css('top')) || 0;
			const final_top = modal_height - win_height + bottom_height ;
			const delta = e.deltaY;
			
			// 2. 배경 위치를 강제로 위로 올림 (Y축 직접 제어)
			// 0.5는 속도입니다. 안 움직이면 이 값을 1로 높여보세요.
			
			
			let cur_top = final_top + moveY;
			
			if(final_top > 0 ){
				
				bgScrollVal += delta;
				moveY = -(bgScrollVal * 0.5);
				
				if(moveY >= 0 && delta < 0){bgScrollVal = 0; moveY = 0;}
				if(cur_top <= 0 && delta > 0){bgScrollVal = final_top*2; moveY = -final_top;}
				
				$target.css({
					'background-attachment': 'scroll', // 고정 해제
					'background-position-y': moveY + 'px' // 단위 꼭 붙임
				});
				return true;
			}
		}else{
			return false;
		}
	}
	//모달 끝
	let page_mod = 0;
	let cur_mod = 0;
	
	//화면 사이즈바뀔 때 모달배경위치 초기화를 위한 모드 계산함수
	function cul_mod(){
		if (modal_page != 0 && $(window).width() > 1024) page_mod = 0;
		else if(modal_page != 0 && $(window).width() > 768) page_mod = 1;
		else page_mod = 2;
		return;
	}
	
	cul_mod();
	
    $(window).on('resize', function() {
        setPosition();
		cul_mod();
		
		if(page_mod != cur_mod){
			const $target = $pages.find('.modal-content').eq(modal_page-1);
			moveY = 0;
			bgScrollVal = 0;
			$target.css({
					'background-position-y': 0 + 'px' // 단위 꼭 붙임
				});
			cur_mod = page_mod;
		}
		
        // 리사이즈 시 현재 인덱스 위치 유지
        if (offsetArray[currentPage] !== undefined) {
            $('html, body').scrollTop(offsetArray[currentPage]);
        }
    }).trigger('resize');

    // 2. 휠 이벤트 (offsetArray.length 기준으로 작동)
	
	
	
    window.addEventListener('wheel', function(e) {
		
		//동작 차단
		e.preventDefault(); 
        if (isScrolling) return;
		
        const totalValidPages = offsetArray.length; // 유효한 좌표 개수
        const delta = e.deltaY;

        // 4. 배경 움직이는 함수 호출
		scrollModal(e);
		
		
		if (scrollModal(e) === true)return;
		
		

        // 위/아래 경계선에서 브라우저 기본 스크롤 허용
        if (delta > 0 && currentPage >= totalValidPages - 1) return;
        if (delta < 0 && currentPage <= 0) return;

        

        if (delta > 0) currentPage++;
        else currentPage--;

        isScrolling = true;

        $('html, body').stop().animate({
            scrollTop: offsetArray[currentPage]
        }, 600, function() {
            isScrolling = false;
        });
    }, { passive: false });

    $('.btn_top').click(function(){
		const $target = $pages.find('.modal-content').eq(modal_page-1);
		if (modal_page != 0){
			moveY = 0;
			bgScrollVal = 0;
			$target.css({
					'background-position-y': 0 + 'px' // 단위 꼭 붙임
				});
			return false;
		}
        currentPage = 0;
    });

    $('.arrows.bt').each(function(i){
        $(this).click(function(e){
            e.preventDefault();
            currentPage == i+1;
            if(offsetArray.length <= i+1){
                    return false;
                }
            $('html, body').stop().animate({
                scrollTop: offsetArray[i+1]
            }, 600, function() {
                isScrolling = false;
            });
        });
    });

    $('.arrows.top').each(function(i){
        $(this).click(function(e){
            e.preventDefault();
            currentPage == i;
            $('html, body').stop().animate({
                scrollTop: offsetArray[i]
            }, 600, function() {
                isScrolling = false;
            });
        });
    });

});









