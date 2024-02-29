import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <div className={styles.imageWrapper}>
          {/* Image will be placed here */}
        </div>
        <div className={styles.imageWrapper2}>
          {/* Image will be placed here */}
        </div>
        <div className={styles.imageWrapper3}>
          {/* Image will be placed here */}
        </div>
        {/* Rest of the right content */}
      </div>
    </div>
  )
}
