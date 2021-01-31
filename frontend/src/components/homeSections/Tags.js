import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Scrollbar } from 'swiper';

import './Tags.scss'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import { setSearch } from '../../redux/actions';

SwiperCore.use([Scrollbar]);

function Tags({ tags }){
    const history = useHistory()

    const dispatch = useDispatch()

    function searchTag(tag){
        dispatch(setSearch(tag))

        history.push('/search')
    }

    const carouselItem = (e, i) => {
        return (
            <SwiperSlide key={`slide-${i}`} onClick={() => searchTag(e.text)}>
                <div className="border text-center rounded bg-light text-dark tag" style={{cursor: 'pointer'}}>
                    {e.text}
                </div>        
            </SwiperSlide>
        )
        
    }

    return (
        <div className="mt-2 mb-2">
            {tags.length > 0 &&
            <Swiper
            spaceBetween={50}
            slidesPerView={2}
            scrollbar={{ draggable: true }}
            className="d-flex justify-content-center pb-3"
            breakpoints={{
                576: {
                    slidesPerView: 4
                },
                768: {
                    slidesPerView: 5
                },
                992: {
                    slidesPerView: 6
                },
                1200: {
                    slidesPerView: 8
                }
            }}
            >
                {tags.map(carouselItem)}
            </Swiper>
            }
        </div>
    )
}

const mapStateToProps = state => state.home;

export default connect(mapStateToProps, null)(Tags)