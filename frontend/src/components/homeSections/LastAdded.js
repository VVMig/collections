import React, { useCallback } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, A11y } from 'swiper'

import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

import './Slider.scss'

import Item from '../items/Item'
import { getHome } from '../../redux/actions'

SwiperCore.use([Navigation, Pagination, A11y])

function LastAdded({ lastAdded }){
    const dispatch = useDispatch()

    const carouselItem = (e, i) => {
        return (
            <SwiperSlide key={`slide-${i}`} className="d-flex justify-content-center pb-5 pt-5">
                <Item itemProps={e} homeAction={like}/>    
            </SwiperSlide>
        )
        
    }

    const like = useCallback(() => {
        dispatch(getHome())
    }, [dispatch])

    return (
        <>
            {lastAdded.length > 0 && 
            <>
                <h2>Last added</h2>
                <Swiper
                navigation
                pagination={{ clickable: true }}
                spaceBetween={50}
                slidesPerView={1}
                breakpoints={{
                    576: {
                        slidesPerView: 2
                    },
                    768: {
                        slidesPerView: 3
                    },
                    1200: {
                        slidesPerView: 4
                    }
                }}
                >
                    {lastAdded.map(carouselItem)}
                </Swiper>
            </>
            }
        </>
    )
}

const mapStateToProps = state => state.home;

export default connect(mapStateToProps, null)(LastAdded)