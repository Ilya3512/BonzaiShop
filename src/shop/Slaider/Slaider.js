import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import styles from "./Slaider.module.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

function Slaider() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000, 
        disableOnInteraction: false,
      }}
      className={styles.swiperContainer}
    >
      <SwiperSlide className={styles.carouselItem}>
        <img
          className={`${styles.carouselImage} d-block w-100`}
          src="/slaider/1.png"
          alt="First slide"
        />
        <h5>Каталог бонсаев</h5>
        <p>На этом сайте вы можете купить бонсаи.</p>
      </SwiperSlide>

      <SwiperSlide className={styles.carouselItem}>
        <img
          className={`${styles.carouselImage} d-block w-100`}
          src="/slaider/2.png"
          alt="Second slide"
        />
        <h5>Правила ухода за растениями</h5>
        <p>Посмотреть индивидуальные правила ухода для каждого растения.</p>
      </SwiperSlide>

      <SwiperSlide className={styles.carouselItem}>
        <img
          className={`${styles.carouselImage} d-block w-100`}
          src="/slaider/3.png"
          alt="Third slide"
        />
        <h5>Искусство бонсай</h5>
        <p>Узнать больше о искусстве бонсай и его истории.</p>
      </SwiperSlide>
      <SwiperSlide className={styles.carouselItem}>
        <img
          className={`${styles.carouselImage} d-block w-100`}
          src="/slaider/4.png"
          alt="Third slide"
        />
        <h5>Что это за растение?</h5>
        <p>Загрузить фото неизвестного растения и узнать что это.</p>
      </SwiperSlide>
    </Swiper>
  );
}

export default Slaider;
