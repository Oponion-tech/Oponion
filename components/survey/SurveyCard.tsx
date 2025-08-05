import Image from "next/image";
import styles from "./styles/SurveyCard.module.css";
import Survey from "@/api/models/survey";

interface SurveyCardProps {
  survey: Survey;
  className: string;
  children?: React.ReactNode;
  icon?: string;
  showDayLabel?: boolean;
  dayLabelText?: string;
}

export default function SurveyCard({
  survey,
  className,
  children = null,
  icon = "📋",
  showDayLabel = false,
  dayLabelText = "Survey of the Day",
}: SurveyCardProps) {
  return (
    <div className={`${styles[`${className}`]}`}>
      {showDayLabel && (
        <div className={styles["survey-of-the-day-label"]}>{dayLabelText}</div>
      )}
      {children}
      <div className={`${styles["survey-card"]}`}>
        <div className={styles["survey-icon"]}>{icon}</div>
        <div className={styles["survey-info"]}>
          <div className={styles["survey-title"]}>{survey.title}</div>
          <div className={styles["survey-genre-votes"]}>
            <div className={styles["survey-genre"]}>
              {survey.genre} · {survey.votes} votes
            </div>
            <div className={styles["survey-points-container"]}>
              {survey.points_reward}
              <Image
                src="/OponionRing.png"
                alt="Oponion Logo"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
