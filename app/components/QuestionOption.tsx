import Image from "next/image";
import styles from '../create/CreatePage.module.css';

interface QuestionOptionProps {
  index: number;
  currentQuestion: any;
  updateQuestionOption: any;
  showRemoveButton?: boolean;
  onRemove?: (index: number) => void;
}

export default function QuestionOption({ index, currentQuestion, updateQuestionOption, showRemoveButton = false, onRemove }: QuestionOptionProps) {
    // Wraparound für Index > 3
    const normalizedIndex = index % 4;
    
    // Switch case für Icons
    const getIcon = (index: number) => {
        switch (index) {
            case 0: return "/onion.png";
            case 1: return "/garlic.png";
            case 2: return "/lauch.png";
            case 3: return "/onion_with_green.png";
            default: return "/onion.png";
        }
    };
    
    // Switch case für CSS-Klassen
    const getColorClass = (index: number) => {
        switch (index) {
            case 0: return styles.colorBoxRed;
            case 1: return styles.colorBoxGreen;
            case 2: return styles.colorBoxBlue;
            case 3: return styles.colorBoxYellow;
            default: return styles.colorBoxRed;
        }
    };

    return (
        <div key={index} className={styles.optionItem}>
            <div className={`${styles.colorBox} ${getColorClass(normalizedIndex)}`}>
                <Image src={getIcon(normalizedIndex)} alt="Option" width={40} height={40} />
            </div>
            <input
                type="text"
                value={currentQuestion.options[index] || ''}
                onChange={(e) => updateQuestionOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className={styles.optionInput}
            />
            {showRemoveButton && onRemove && (
                <button
                    onClick={() => onRemove(index)}
                    className={styles.removeOption}
                >
                    ✕
                </button>
            )}
        </div>
    )
}