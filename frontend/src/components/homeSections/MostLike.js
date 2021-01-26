import React, { useCallback } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, A11y } from 'swiper'

import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

import Item from '../items/Item'
import { getHome } from '../../redux/actions'

SwiperCore.use([Navigation, Pagination, A11y])

function MostLike(props){
    const { mostLike } = useSelector(state => state.home)

    const dispatch = useDispatch()

    const carouselItem = (e, i) => {
        return (
            <SwiperSlide key={`slide-${i}`} className="d-flex pb-5 pt-5 justify-content-center">
                <Item itemProps={e} homeAction={like}/>    
            </SwiperSlide>
        )
        
    }

    const like = useCallback(() => {
        dispatch(getHome())
    }, [dispatch])

    return (
        <>
        {mostLike.length && 
        <Swiper
        navigation
        pagination={{ clickable: true }}
        spaceBetween={50}
        slidesPerView={1}
        >
            {mostLike.map(carouselItem)}
        </Swiper>
        }
        </>
    )
}

const mapStateToProps = state => state.home;

export default connect(mapStateToProps, null)(MostLike)