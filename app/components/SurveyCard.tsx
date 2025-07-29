import Image from "next/image";
import styles from './SurveyCard.module.css';

type Survey = {
  id: number;
  title: string;
  genre: string;
  votes: string;
  points: number;
  icon?: string; // optional, falls du verschiedene Icons willst
  className?: string; // für spezielle Styles wie survey-of-the-day
  children?: React.ReactNode; // für z.B. das Label
};

export default function SurveyCard({ title, genre, votes, points, icon = "📋", className = "", children }: Survey) {
  return (
    <div className={`${styles[`${className}`]}`}>
    {children}
    <div className={`${styles["survey-card"]}`}>
      <div className={styles["survey-icon"]}>{icon}</div>
      <div className={styles["survey-info"]}>
        <div className={styles["survey-title"]}>{title}</div>
        <div className={styles["survey-genre-votes"]}>
          <div className={styles["survey-genre"]}>{genre} · {votes} votes</div>
          <div className={styles["survey-points-container"]}>
            {points}
            <Image src="/OponionRing.png" alt="Oponion Logo" width={20} height={20} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}