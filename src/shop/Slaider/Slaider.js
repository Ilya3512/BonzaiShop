import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import styles from "./Slaider.module.css";

// Импортируем необходимые модули Swiper
import { Navigation, Pagination, Autoplay } from "swiper/modules";

function Slaider() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000, // задержка между переключениями в миллисекундах (3 секунды)
        disableOnInteraction: false, // автопрокрутка не отключается при взаимодействии пользователя
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
        <h5>Исскуство бонсай</h5>
        <p>Узнать больше о искусстве бонсай и его истории.</p>
      </SwiperSlide>
    </Swiper>
  );
}

export default Slaider;
