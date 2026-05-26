import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "nav": {
        "about": "ABOUT US",
        "services": "SERVICES",
        "faqs": "FAQs",
        "refer": "REFER PATIENT",
        "join": "JOIN NETWORK",
        "license": "GOVERNMENT LICENSE",
        "portal": "MY PORTAL",
        "contact": "CONTACT US"
      },
      "hero": {
        "title1": "Compassionate & Professional",
        "title2": "In-Home Care",
        "desc": "PrimeVita offers reliable, culturally sensitive domiciliarly care for your loved ones right in the comfort of their home.",
        "learnMore": "Learn More",
        "requestCaregiver": "REQUEST A CAREGIVER"
      }
    }
  },
  yo: {
    translation: {
      "nav": {
        "about": "NIPA WAA",
        "services": "IṢẸ WA",
        "faqs": "AWỌN IBEERE",
        "refer": "TỌKA ALAIISAN",
        "join": "DARAPỌ MỌ WA",
        "license": "IWE-AṢẸ IJỌBA",
        "portal": "PORTAL MI",
        "contact": "PE WA"
      },
      "hero": {
        "title1": "Itọju Ile Alaafia",
        "title2": "Ati Ọjọgbọn",
        "desc": "PrimeVita nfunni ni itọju to dara fun awọn ololufẹ rẹ ni itunu ile wọn.",
        "learnMore": "Kọ ẹkọ diẹ sii",
        "requestCaregiver": "BEERE FUN OLUTỌJU"
      }
    }
  },
  ig: {
    translation: {
      "nav": {
        "about": "BANYERE ANYI",
        "services": "ỌRỤ ANYI",
        "faqs": "AJỤJỤ",
        "refer": "ZIGA ONYE ỌRỊA",
        "join": "SONYERE ANYI",
        "license": "IKIKERE GỌỌMEMENTI",
        "portal": "EBE M",
        "contact": "KPỌTỤRỤ ANYI"
      },
      "hero": {
        "title1": "Nlekọta Ezi na Ụlọ",
        "title2": "Nke Pụrụ Iche",
        "desc": "PrimeVita na-enye nlekọta dị mma maka ndị ị hụrụ n'anya n'ụlọ ha.",
        "learnMore": "Mụta Ihe",
        "requestCaregiver": "RỊỌ ONYE MLEKỌTA"
      }
    }
  },
  ha: {
    translation: {
      "nav": {
        "about": "GAME DA MU",
        "services": "AYYUKAN MU",
        "faqs": "TAMBAYOYI",
        "refer": "KAWO MAI LAIFI",
        "join": "SHIGA MU",
        "license": "LASISIN GWAMNATI",
        "portal": "SHAFINA",
        "contact": "TUNTUBE MU"
      },
      "hero": {
        "title1": "Kula da Gida Na",
        "title2": "Kwarai da Gaske",
        "desc": "PrimeVita tana ba da kulawa mai kyau ga masoyanku a cikin kwanciyar hankali na gidansu.",
        "learnMore": "Kara Koyo",
        "requestCaregiver": "NEMI MAI KULA"
      }
    }
  },
  fr: {
    translation: {
        "nav": {
            "about": "À PROPOS",
            "services": "SERVICES",
            "faqs": "FAQ",
            "refer": "RÉFÉRER",
            "join": "REJOINDRE",
            "license": "LICENCE",
            "portal": "MON PORTAIL",
            "contact": "CONTACTEZ-NOUS"
        },
        "hero": {
            "title1": "Soins à Domicile",
            "title2": "Professionnels",
            "desc": "PrimeVita offre des soins à domicile fiables pour vos proches.",
            "learnMore": "En Savoir Plus",
            "requestCaregiver": "DEMANDER UN SOIGNANT"
        }
    }
  },
  es: {
    translation: {
        "nav": {
            "about": "NOSOTROS",
            "services": "SERVICIOS",
            "faqs": "FAQ",
            "refer": "REFERIR",
            "join": "UNIRSE",
            "license": "LICENCIA",
            "portal": "MI PORTAL",
            "contact": "CONTÁCTENOS"
        },
        "hero": {
            "title1": "Cuidado Domiciliario",
            "title2": "Profesional",
            "desc": "PrimeVita ofrece atención domiciliaria confiable para sus seres queridos.",
            "learnMore": "Aprende Más",
            "requestCaregiver": "SOLICITAR UN CUIDADOR"
        }
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;
