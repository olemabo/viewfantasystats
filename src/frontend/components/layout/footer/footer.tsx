import FooterContainer from "./footer-section/footer-section";
import { LeagueProps } from "@/types/league";
import Link from "next/link";
import { Code, Twitter } from "@mui/icons-material";
import { URLS } from "@/constants/urls";
import styles from "./footer.module.css";

export default async function Footer({ leagueType }: LeagueProps) {
  return (
    <footer className={`${styles.footer} ${styles[leagueType] ?? ""}`}>
      <div className={styles.footerContainer}>
        <FooterContainer leagueType={leagueType} />
        <div className={styles.footerSectionSocialMedia}>
          <div>
            <Twitter />
            <Link target="_blank" href={URLS.EXTERNAL.PERSONAL.TWITTER}>
              Twitter
            </Link>
          </div>
          <div>
            <Code />
            <Link target="_blank" href={URLS.EXTERNAL.PERSONAL.GITHUB}>
              Code
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
