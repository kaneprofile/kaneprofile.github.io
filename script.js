// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 파티클 효과 초기화
    initParticles();
    
    // 네비게이션 기능 초기화
    initNavigation();
    
    // 브금 컨트롤 초기화
    initMusicControl();
    
    // 갤러리 초기화
    initGallery();
    
    // 스크롤 애니메이션 초기화
    initScrollAnimations();
    
    // 스무스 스크롤링 초기화
    initSmoothScrolling();
    
    // 반응형 대응 초기화
    initResponsive();
});

// 파티클 효과 초기화
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 50,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#dc2626', '#991b1b', '#666666']
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.5
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#dc2626',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// 네비게이션 기능 초기화
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const header = document.querySelector('.header');
    
    // 햄버거 메뉴 토글
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // 모바일 메뉴 링크 클릭 시 메뉴 닫기
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // 스크롤 시 헤더 스타일 변경
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(220, 38, 38, 0.3)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// 브금 컨트롤 초기화
function initMusicControl() {
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    const playIcon = musicBtn.querySelector('.play-icon');
    const pauseIcon = musicBtn.querySelector('.pause-icon');
    
    let isPlaying = false;
    
    if (musicBtn && bgMusic) {
        // 볼륨 설정 (모바일 고려하여 낮게 설정)
        bgMusic.volume = 0.3;
        
        musicBtn.addEventListener('click', function() {
            if (isPlaying) {
                bgMusic.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                musicBtn.classList.remove('playing');
            } else {
                // 사용자 상호작용 후 재생 (모바일 정책 준수)
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'block';
                        musicBtn.classList.add('playing');
                    }).catch(error => {
                        console.log('음악 재생 실패:', error);
                        // 재생 실패 시 사용자에게 알림
                        showToast('음악 재생이 지원되지 않는 브라우저입니다.');
                    });
                }
            }
            isPlaying = !isPlaying;
        });
        
        // 음악 종료 시 버튼 상태 리셋
        bgMusic.addEventListener('ended', function() {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            musicBtn.classList.remove('playing');
            isPlaying = false;
        });
        
        // 오디오 로드 에러 처리
        bgMusic.addEventListener('error', function() {
            console.log('음악 파일 로드 실패');
            musicBtn.style.display = 'none';
        });
    }
}

// 갤러리 초기화
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentImageIndex = 0;
    let images = [];
    
    // 갤러리 아이템들 정보 수집
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay span');
        
        images.push({
            src: item.dataset.image || img.src,
            alt: img.alt || overlay.textContent || `갤러리 이미지 ${index + 1}`
        });
        
        // 갤러리 아이템 클릭 이벤트
        item.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox();
        });
        
        // 키보드 접근성
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentImageIndex = index;
                openLightbox();
            }
        });
    });
    
    // 라이트박스 열기
    function openLightbox() {
        if (lightbox && lightboxImage && images[currentImageIndex]) {
            lightboxImage.src = images[currentImageIndex].src;
            lightboxImage.alt = images[currentImageIndex].alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // 포커스 관리
            lightboxClose.focus();
        }
    }
    
    // 라이트박스 닫기
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            
            // 원래 갤러리 아이템으로 포커스 복귀
            if (galleryItems[currentImageIndex]) {
                galleryItems[currentImageIndex].focus();
            }
        }
    }
    
    // 이전/다음 이미지
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex].src;
        lightboxImage.alt = images[currentImageIndex].alt;
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex].src;
        lightboxImage.alt = images[currentImageIndex].alt;
    }
    
    // 이벤트 리스너들
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevImage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }
    
    // 라이트박스 배경 클릭 시 닫기
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // 키보드 네비게이션
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
    
    // 터치 스와이프 지원 (모바일)
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (lightboxImage) {
        lightboxImage.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        lightboxImage.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 왼쪽으로 스와이프 - 다음 이미지
                showNextImage();
            } else {
                // 오른쪽으로 스와이프 - 이전 이미지
                showPrevImage();
            }
        }
    }
}

// 스크롤 애니메이션 초기화
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // 애니메이션할 요소들 관찰
    const animateElements = document.querySelectorAll('.section, .feature-card, .preference-card, .gallery-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// 스무스 스크롤링 초기화
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// 반응형 대응 초기화
function initResponsive() {
    // 뷰포트 높이 조정 (모바일 브라우저 주소창 고려)
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', debounce(setViewportHeight, 100));
    
    // 오리엔테이션 변경 감지
    window.addEventListener('orientationchange', function() {
        setTimeout(setViewportHeight, 100);
    });
    
    
    // 이미지 레이지 로딩
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });
    }
}

// 유틸리티 함수들
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 토스트 메시지 표시
function showToast(message, duration = 3000) {
    // 기존 토스트가 있다면 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(220, 38, 38, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .loading {
        filter: blur(2px);
        opacity: 0.6;
    }
`;
document.head.appendChild(style);

// 에러 핸들링
window.addEventListener('error', function(e) {
    console.error('JavaScript 에러:', e.error);
});

// 성능 모니터링 (개발용)
if (window.performance && window.performance.mark) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('페이지 로드 완료:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}
