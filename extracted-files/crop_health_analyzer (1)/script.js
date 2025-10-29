// Simple client-side logic for demo Crop Health Analyzer
// NOTE: This is a static demo. In production the analysis would call a server-side AI model.

function $(id){return document.getElementById(id)}

// --- Translations (centralized) ---
const I18N = {
  "en": {
    "brand.name":"Crop Health Analyzer",
    "nav.home":"Home","nav.upload":"Upload","nav.dashboard":"Dashboard","nav.kb":"Knowledge base","nav.contact":"Contact","nav.admin":"Admin",
    "auth.sign_in":"Sign in","auth.sign_up":"Sign up","voice.guide":"🔊 Voice Guide",
    "dashboard.title":"Your Dashboard","dashboard.btn_upload_new":"Upload New Image","dashboard.btn_clear_history":"Clear History","analytics.title":"Analytics","dashboard.empty_history":"<p>No saved analyses yet.</p>",
    "footer.copy":"© Crop Health Analyzer",
    "index.hero_title":"Detect Crop Diseases Instantly Using AI","index.hero_sub":"Upload a photo of your crop (leaf, stem, fruit) and get an instant diagnosis with remedies.","index.cta_upload":"Upload Crop Image","index.before_after":"Before & After Crop Analysis","index.success_stories":"Success Stories","index.testimonial_1":"\"Saved my tomato crop!\" — Rani, farmer","index.testimonial_2":"\"Easy and fast diagnosis.\" — Karan, farmer",
    "features.upload":"📷 Upload Image","features.upload_desc":"Take or upload multiple images for better accuracy.",
    "kb.title":"Knowledge Base","kb.search_placeholder":"Search topics, symptoms or remedies...","kb.filter_crop":"All crops","kb.filter_type":"All types","kb.filter_season":"All seasons","kb.option_all":"All",
    "kb.q_tomato_leafblight":"Tomato — Leaf Blight","kb.symptoms":"Symptoms:","kb.remedy":"Remedy:","kb.prevention":"Prevention:","kb.a_tomato_leafblight_symptoms":"brown spots on leaves, yellowing.","kb.a_tomato_leafblight_remedy":"Remove affected leaves, neem spray (organic). Apply recommended fungicide if severe.","kb.a_tomato_leafblight_prevention":"Crop rotation, spacing, and avoid overhead irrigation at night.","kb.read_aloud":"🔊 Read aloud",
    "upload.title":"Upload Crop Image for Disease Analysis","upload.choose_files":"📁 Choose Image(s)","upload.capture_camera":"📸 Capture From Camera","upload.crop_type":"Crop Type","upload.analyze":"Analyze Image","upload.status":"","upload.analyzing":"Analyzing...","upload.done_redirect":"Done. Redirecting to result...",
    "result.no_image":"No image available","result.no_recent":"No recent analysis found","result.remedy_organic":"Organic: Apply neem-based spray, remove affected leaves.","result.remedy_chemical":"Chemical: Use recommended fungicide/pesticide as per label. Follow safety instructions.","result.remedy_preventive":"Preventive: Crop rotation, proper irrigation, balanced fertilization.","result.prevention_list":"<li>Maintain good drainage</li><li>Avoid overhead irrigation at night</li><li>Use certified seeds</li>","result.saved_dashboard":"Saved to dashboard","result.no_record_download":"No record to download","result.ask_expert":"Contact form in Contact page for expert help (demo)",
    "contact.fill_all":"Please fill all fields","contact.sent":"Message sent (demo). We will contact you.",
    "login.enter_credentials":"Please enter email and password","login.invalid_credentials":"Invalid credentials (demo). You can use Demo Login or Sign up.","login.demo_logged":"Logged in as demo@farm.test","signup.fill_fields":"Please fill all fields","signup.user_exists":"User already exists. Please login.","signup.created":"Account created (demo). You are now logged in.",
    "dashboard.confirm_clear":"Clear all history?"
  },
  "hi": {
    "brand.name":"Crop Health Analyzer",
    "nav.home":"होम","nav.upload":"अपलोड","nav.dashboard":"डैशबोर्ड","nav.kb":"ज्ञानकोष","nav.contact":"संपर्क","nav.admin":"प्रशासक",
    "auth.sign_in":"साइन इन","auth.sign_up":"साइन अप","voice.guide":"🔊 वॉयस गाइड",
    "dashboard.title":"आपका डैशबोर्ड","dashboard.btn_upload_new":"नई छवि अपलोड करें","dashboard.btn_clear_history":"हिस्ट्री साफ़ करें","analytics.title":"विश्लेषण","dashboard.empty_history":"<p>कोई सहेजा गया विश्लेषण नहीं है।</p>",
    "footer.copy":"© Crop Health Analyzer",
    "index.hero_title":"एआई के साथ तुरंत फसल रोग का पता लगाएं","index.hero_sub":"अपनी फसल (पत्ती, तना, फल) की फोटो अपलोड करें और तुरंत निदान प्राप्त करें।","index.cta_upload":"फसल छवि अपलोड करें","index.before_after":"पहले और बाद की विश्लेषण","index.success_stories":"सफलता की कहानियाँ","index.testimonial_1":"\"मेरी टमाटर की फसल बच गई!\" — रानी","index.testimonial_2":"\"सरल और त्वरित निदान।\" — करण",
    "features.upload":"📷 छवि अपलोड करें","features.upload_desc":"बेहतर सटीकता के लिए कई छवियाँ अपलोड करें।",
    "kb.title":"ज्ञानकोष","kb.search_placeholder":"विषयों, लक्षणों या उपचारों को खोजें...","kb.filter_crop":"सभी फसलें","kb.filter_type":"सभी प्रकार","kb.filter_season":"सभी मौसम","kb.option_all":"सभी",
    "kb.q_tomato_leafblight":"टमाटर — लीफ ब्लाइट","kb.symptoms":"लक्षण:","kb.remedy":"उपचार:","kb.prevention":"रोकथಾಮ:","kb.a_tomato_leafblight_symptoms":"पत्तियों पर भूरे रंग के धब्बे, पीलापन।","kb.a_tomato_leafblight_remedy":"प्रभावित पत्तियाँ हटाएँ, नीम का छिड़काव (ऑर्गेनिक)। गंभीर होने पर फफूंदनಾಶक लागू करें।","kb.a_tomato_leafblight_prevention":"फसल चक्रीकरण, दूरी और रात में ऊपर से सिंचाई से बचें।","kb.read_aloud":"🔊 पढ़ें",
    "upload.title":"रोग विश्लेषण के लिए फसल छवि अपलोड करें","upload.choose_files":"📁 छवಿಗಳು चुनें","upload.capture_camera":"📸 कैमरा से कैप್ಚರ್ करें","upload.crop_type":"फसल प्रकार","upload.analyze":"छवि विश्लेषण करें","upload.status":"","upload.analyzing":"विश्लेषಿಸುತ್ತಿದೆ...","upload.done_redirect":"ಮುಗಿದು. ಫಲಿತಾಂಶಕ್ಕೆ ದಿಕ್ಕುಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
    "result.no_image":"ಕೋನ್ನಡ: ಚಿತ್ರ ಲಭ್ಯವಿಲ್ಲ","result.no_recent":"ಇತ್ತೀಚಿನ ವಿಶ್ಲೇಷಣೆಯೇ ಇಲ್ಲ","result.remedy_organic":"ಆರ್ಗ್ಯಾನಿಕ್: ನೀಮ್ ಆಧಾರಿತ ಫ್ಲು ಈಜಿಸಿ, ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.","result.remedy_chemical":"ಕ್ಲೆಮಿಕಲ್: ಲೇಬಲ್ ಪ್ರಕಾರ ಶಿಫಾರಸು ಮಾಡಿದ ಫಂಗಿಸೈಡ್/ಪೆಸ್ಟಿಸೈಡ್ ಬಳಸಿ.","result.remedy_preventive":"ತಡೆಗಟ್ಟುವ ಕ್ರಮ: ಫಸಲ ಚಕ್ರ, ಯೋಗ್ಯ ಜಲಸಂಪನ್ಮೂಲ, ಸಮತೋಲನ ಹಾರ್ಮೋನಿನ ಪೋಷಣ.","result.prevention_list":"<li>ಉತ್ತಮ ಡ್ರೆನೇಜ್ ಶೇರು</li><li>ರಾತ್ರಿ ವೇಳೆ ಮೇಲಿಂದ ನೀರು ಹರಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ</li><li>ಸಾಕ್ಷಿ ಬೀಜಗಳನ್ನು ಬಳಸಿ</li>","result.saved_dashboard":"ಡ್ಯಾಶ್ಬೋರ್ಡ್‌ಗೆ ಉಳಿಸಲಾಗಿದೆ","result.no_record_download":"ಉಳಿಕೆಯ ದಾಖಲೆ ಇಲ್ಲ","result.ask_expert":"ಎಕ್ಸ್ಪರ್ಟ್ ಸಹಾಯಕ್ಕಾಗಿ ಸಂಪರ್ಕ ಪುಟದ ಫಾರ್ಮ್ ನೋಡಿ (ಡೆಮೋ)",
    "contact.fill_all":"ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ","contact.sent":"ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ (ಡೆಮೋ). ನಾವು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.",
    "login.enter_credentials":"ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್ವರ್ಡ್ ನಮೂದಿಸಿ","login.invalid_credentials":"ಅಮಾನ್ಯ ಪ್ರಮಾಣಪತ್ರಗಳು (ಡೆಮೋ). ನೀವು ಡೆಮೊ ಲಾಗಿನ್ ಅಥವಾ ಸೈನ್ ಅಪ್ ಅನ್ನು ಬಳಸಬಹುದು.","login.demo_logged":"ಡೆಮೊ@farm.test ಆಗಿ ಲಾಗಿನ್ ಆಗಿದೆ","signup.fill_fields":"ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ","signup.user_exists":"ಬಳಕೆದಾರ ಈಗಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.","signup.created":"ಖಾತೆ ರಚಿಸಲಾಗಿದೆ (ಡೆಮೋ). ನೀವು ಈಗ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ.",
    "dashboard.confirm_clear":"ಎಲ್ಲಾ ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಬೇಕಾ?"
  },
  "kn": {
    "brand.name":"ಕ್ರಾಪ್ ಹೆಲ್ತ್ ಅನಾಲೈಸರ್",
    "nav.home":"ಮುಖಪುಟ","nav.upload":"ಅಪ್‌ಲೋಡ್","nav.dashboard":"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್","nav.kb":"ಜ್ಞಾನ ಭಂಡಾರ","nav.contact":"ಸಂಪರ್ಕ","nav.admin":"ಪ್ರಶಾಸಕ",
    "auth.sign_in":"ಲಾಗಿನ್","auth.sign_up":"ನೋಂದಣಿ","voice.guide":"🔊 ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ",
    "dashboard.title":"ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್","dashboard.btn_upload_new":"ಹೊಸ ಚಿತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ","dashboard.btn_clear_history":"ಇತಿಹಾಸ ತೆರವುಗೊಳಿಸಿ","analytics.title":"ವಿಶ್ಲೇಷಣೆ","dashboard.empty_history":"<p>ಇನ್‌ ಸ್ಟೋರ್ ಮಾಡಿದ ಯಾವುದೇ ವಿಶ್ಲೇಷಣೆಗಳಿಲ್ಲ.</p>",
    "footer.copy":"© Crop Health Analyzer",
    "index.hero_title":"ಏಐ ಬಳಸಿ ತಕ್ಷಣ ಫಸಲಿನ ರೋಗವನ್ನು ಪತ್ತೆಮಾಡಿ","index.hero_sub":"ನಿಮ್ಮ ಬೆಳೆ (ಎಲೆ, ಕೊಂಬು, ಹಣ್ಣು) ಚಿತ್ರವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ತಕ್ಷಣ ಡಯಾಗ್ನೋಸಿಸ್ ಪಡೆಯಿರಿ.","index.cta_upload":"ಫಸಲಿನ ಚಿತ್ರಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ","index.before_after":"ಮುಂಚಿತ ಮತ್ತು ನಂತರ ವಿಶ್ಲೇಷಣೆ","index.success_stories":"ಯಶೋಗಾಥೆ","index.testimonial_1":"\"ನನ್ನ ಟೊಮೇಟೊ ಬೆಳೆ ಉಳಿಲಿತು!\" — ರಾಣಿ","index.testimonial_2":"\"ಸರಳ ಮತ್ತು ತ್ವರಿತ ಸೂಚನೆಗಳು.\" — ಕರಣ",
    "features.upload":"📷 ಚಿತ್ರ ಅಪ್ಲೋಡ್","features.upload_desc":"ಅಧಿಕ ನಿಖರತೆಯಿಗಾಗಿ ಅನೇಕ ಚಿತ್ರಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ.",
    "kb.title":"ಜ್ಞಾನ ಭಂಡಾರ","kb.search_placeholder":"ವಿಷಯಗಳು, ಲಕ್ಷಣಗಳು ಅಥವಾ ಚಿಕಿತ್ಸೆಯನ್ನು ಹುಡುಕಿ...","kb.filter_crop":"ಎಲ್ಲಾ ಬೆಳೆಗಳು","kb.filter_type":"ಎಲ್ಲಾ ಪ್ರಕಾರಗಳು","kb.filter_season":"ಎಲ್ಲಾ ಋತುಗಳು","kb.option_all":"ಎಲ್ಲಾ",
    "kb.q_tomato_leafblight":"ಟೊಮೇಟೊ — ಲೀಫ್ ಬ್ಲೈಟ್","kb.symptoms":"ಲಕ್ಷಣಗಳು:","kb.remedy":"ಪರಿಹಾರ:","kb.prevention":"ತಡೆಯುವ ಕ್ರಮ:","kb.a_tomato_leafblight_symptoms":"ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಗೋಳಿಗಳು, ಬಿಳಿಯಾದ ಅನುಭವ.","kb.a_tomato_leafblight_remedy":"ಸಂಪೂರ್ಣವಾಗಿ ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ, ನೀಮ್ ಸ್ಪ್ರೇ ಬಳಸಿ.","kb.a_tomato_leafblight_prevention":"ಫಸಲ ಚಕ್ರ, ಸರಿಯಾದ ಅಂತರ ಮತ್ತು ರಾತ್ರಿ ಸಮಯದಲ್ಲಿ ಮೇಲ್ಮೈ ಜಲಸಿಂಚಿತವನ್ನು ತಪ್ಪಿಸಿ.","kb.read_aloud":"🔊 ಓದಿ",
    "upload.title":"ರೋಗ ವಿಶ್ಲೇಷಣೆಗೆ ಬೆಳೆ ಚಿತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ","upload.choose_files":"📁 ಚಿತ್ರಗಳನ್ನು ಆರಿಸಿ","upload.capture_camera":"📸 ಕ್ಯಾಮೆರಾ ಬಳಸಿ ಸೆರೆಹಿಡಿ","upload.crop_type":"ಬೆಳೆ ಪ್ರಕಾರ","upload.analyze":"ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಿ","upload.status":"","upload.analyzing":"ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...","upload.done_redirect":"ಸಂಪೂರ್ಣ. ಪರಿಣಾಮಕ್ಕೆ ಮರುನಿರ್ದೇಶನವಾಗುತ್ತಿದೆ...",
    "result.no_image":"ಚಿತ್ರ ಲಭ್ಯವಿಲ್ಲ","result.no_recent":"ಇತ್ತೀಚಿನ ವಿಶ್ಲೇಷಣೆ ಕಂಡುಕೊಳ್ಳಲಿಲ್ಲ","result.remedy_organic":"ಕಾರಗ್ಯಾನಿಕ್: ನೀಮ್ ಆಧಾರಿತ ಸ್ರೇ ಮಾಡಿ, ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.","result.remedy_chemical":"ರಾಸಾಯನಿಕ: ಲೇಬಲ್ ಪ್ರಕಾರ ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧಿ ಬಳಸಿ.","result.remedy_preventive":"ತಡೆಗಟ್ಟುವ ಕ್ರಮ: ಫಸಲ ಚಕ್ರ, ಸಮತೋಲನ ನೀರು, ಸಮತೋಲನ ಹಾರ್ಮೋನಿನ ಪೋಷಣ.","result.prevention_list":"<li>ಉತ್ತಮ ಜಲ ನಿರ್ಗಮನವನ್ನು ಕಾಯಿರಿ</li><li>ರಾತ್ರಿ ಸಂದರ್ಭದಲ್ಲಿ ಮೇಲ್ಮುಖ ಜಲಸಿಂಚನೆ ತಪ್ಪಿಸಿ</li><li>ಪ್ರಮಾಣೀಕೃತ ಬೀಜಗಳನ್ನು ಉಪಯೋಗಿಸಿ</li>","result.saved_dashboard":"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ಗೆ ಉಳಿಸಲಾಗಿದೆ","result.no_record_download":"ಡೌನ್ಲೋಡ್ ಮಾಡಲು ದಾಖಲೆ ಇಲ್ಲ","result.ask_expert":"ವಿಶೇಷಜ್ಞ ಸಹಾಯಕ್ಕಾಗಿ ಸಂಪರ್ಕ ಪುಟದ ಫಾರ್ಮ್ ನೋಡಿ (ಡೆಮೊ)",
    "contact.fill_all":"ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ","contact.sent":"ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ (ಡೆಮೊ). ನಾವು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.",
    "login.enter_credentials":"ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ","login.invalid_credentials":"ಅಮಾನ್ಯ ಕ್ರೆಡೆನ್ಷಿಯಲ್‌ಗಳು (ಡೆಮೊ). ಡೆಮೊ ಲಾಗಿನ್ ಅಥವಾ ಸೈನ್ ಅಪ್ ಬಳಸಿ.","login.demo_logged":"ಡೆಮೊ@farm.test ಆಗಿ ಲಾಗಿನ್ ಆಗಿದೆ","signup.fill_fields":"ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ","signup.user_exists":"ಬಳಕೆದಾರ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.","signup.created":"ಖಾತೆ ರಚಿಸಲಾಗಿದೆ (ಡೆಮೊ). ನೀವು ಈಗ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ.",
    "dashboard.confirm_clear":"ಎಲ್ಲಾ ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಬೇಕಾ?"
  }
  ,
  "ta": {
    "brand.name":"க்ராப் ஹெல்த் அனலைசர்",
    "nav.home":"முகப்பு","nav.upload":"அப்லோட்","nav.dashboard":"டாஷ்போர்டு","nav.kb":"அறிவு தளம்","nav.contact":"தொடர்பு","nav.admin":"அட்மின்",
    "auth.sign_in":"உள் நுழை","auth.sign_up":"பதிவு","voice.guide":"🔊 குரல் வழிகாட்டு",
    "dashboard.title":"உங்கள் டாஷ்போர்டு","dashboard.btn_upload_new":"புதிய படத்தை பதிவேற்றவும்","dashboard.btn_clear_history":"இறையலை சுத்தம் செய்","analytics.title":"பகுப்பாய்வு","dashboard.empty_history":"<p>தற்சமயம் சேமிக்கப்பட்ட பகுப்பாய்வுகள் இல்லை.</p>",
    "footer.copy":"© Crop Health Analyzer",
    "index.hero_title":"ஏ.ஐ மூலம் உடனடி பயிர் நோய்களை கண்டறியுங்கள்","index.hero_sub":"உங்கள் பயிரின் (இலை, கம்பு, பழம்) படத்தை பதிவேற்றவும் மற்றும் உடனடி திடீர் கண்டறிதல் பெறுங்கள்.","index.cta_upload":"பயிர் படம் பதிவேற்","index.before_after":"முன் & பின் பயிர் பகுப்பாய்வு","index.success_stories":"வெற்றிக் கதைகள்","index.testimonial_1":"\"என்னுடைய தக்காளி பயிர் காப்ப்பட்டது!\" — ராணி","index.testimonial_2":"\"எளிதான மற்றும் விரைவு கண்டறிதல்.\" — கரண்",
    "features.upload":"📷 படம் பதிவேற்று","features.upload_desc":"மேலாண்மை ஆதரவு பெற பல படங்களை பதிவேற்றவும்.",
    "kb.title":"அறிவு தளம்","kb.search_placeholder":"தலைப்புகள், அறிகுறிகள் அல்லது சிகிச்சைகளை தேடவும்...","kb.filter_crop":"அணைத்து பயிர்கள்","kb.filter_type":"அனைத்து வகைகள்","kb.filter_season":"அனைத்து பருவங்கள்","kb.option_all":"அனைத்து",
    "kb.q_tomato_leafblight":"தக்காளி — இலையின் பிளைட்","kb.symptoms":"அறிகுறிகள்:","kb.remedy":"சிகிச்சை:","kb.prevention":"தடி:","kb.a_tomato_leafblight_symptoms":"இலைகளில் பழுப்பு சின்னங்கள், மஞ்சள் நிறம்.","kb.a_tomato_leafblight_remedy":"மாபெரும் இலைகளை நீக்கவும், நீம் ஸ்ப்ரே பயன்படுத்தவும்.","kb.a_tomato_leafblight_prevention":"பயிர் மடிப்பு, இடைவெளி மற்றும் இரவில் மேல்நீர் எய்தல் தவிர்க்கவும்.","kb.read_aloud":"🔊 கேட்க",
    "upload.title":"நோய்த்தயார் பகுப்பாய்விற்கு பயிர் படம் பதிவேற்றவும்","upload.choose_files":"📁 படங்களை தேர்ந்தெடுக்கவும்","upload.capture_camera":"📸 கேமரா மூலம் பிடிக்கவும்","upload.crop_type":"பயிர் வகை","upload.analyze":"படத்தை பகுப்பாய்வு செய்","upload.status":"","upload.analyzing":"பகுப்பாய்வு நடைபெறுகிறது...","upload.done_redirect":"முடிந்தது. முடிவிற்கு திருப்பப்படுகிறது...",
    "result.no_image":"படம் கிடைக்கவில்லை","result.no_recent":"எந்த சமீபத்திய பகுப்பாய்வும் இல்லை","result.remedy_organic":"சுயவிவரம்: நீம் படிகையைப் பயன்படுத்தவும், பாதித்த இலைகளை அகற்று.","result.remedy_chemical":"வேதிப்பொருள்: லேபிள் பிரகாரம் பரிந்துரைக்கப்பட்ட பொருளைப் பயன்படுத்தவும்.","result.remedy_preventive":"தடுப்பு: பயிர் மாறுதல், சரியான காலிப்பிடிப்பு, சமநிலைப் பொஷாக்கு.","result.prevention_list":"<li>உட்புற நீர் வடிகால் பராமரிக்கவும்</li><li>இரவில் மேல்நீர் தவிர்க்கவும்</li><li>சான்றிதழ் விதைகள் பயன்படுத்தவும்</li>","result.saved_dashboard":"டாஷ்போர்டிற்கு சேமிக்கப்பட்டது","result.no_record_download":"பதிவிற்குத் தரவை இல்லை","result.ask_expert":"விரிவாக உதவிக்கான தொடர்புச்சேவை (டெமோ)",
    "contact.fill_all":"தயவு செய்து அனைத்து புலங்களையும் நிரப்பவும்","contact.sent":"செய்தி அனுப்பப்பட்டது (டெமோ). நாங்கள் தொடர்புகொள்கிறோம்.",
    "login.enter_credentials":"தயவு செய்து மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்","login.invalid_credentials":"தவறான அங்கீகாரம் (டெமோ). நீங்கள் டெமோ உள்நுழைவோ அல்லது பதிவு செய்யலாம்.","login.demo_logged":"demo@farm.test ஆக உள்நுழைந்தது","signup.fill_fields":"தயவு செய்து அனைத்து புலங்களையும் நிரப்பவும்","signup.user_exists":"பயனர் ஏற்கனவே உள்ளது. தயவு செய்து உள்நுழைக","signup.created":"கணக்கு உருவாக்கப்பட்டது (டெமோ). நீங்கள் தற்போது உள்நுழைந்துள்ளீர்கள்.",
    "dashboard.confirm_clear":"எல்லா வரலாற்றையும் அகற்ற வேண்டுமா?"
  }
}

function translate(key){
  const code = localStorage.getItem('cha_lang') || 'en'
  return (I18N[code] && I18N[code][key]) || I18N['en'][key] || ''
}

// Handle previews on upload page
const fileInput = $("fileInput")
const cameraInput = $("cameraInput")
const preview = $("preview")
const analyzeBtn = $("analyzeBtn")
const analyzeStatus = $("analyzeStatus")

if(fileInput){
  fileInput.addEventListener('change', e=>{
    showPreviews(e.target.files)
  })
}
if(cameraInput){
  cameraInput.addEventListener('change', e=>{
    showPreviews(e.target.files)
  })
}

function showPreviews(files){
  preview.innerHTML = ""
  Array.from(files).forEach((file, idx)=>{
    const reader = new FileReader()
    reader.onload = ev=>{
      const img = document.createElement('img')
      img.src = ev.target.result
      img.alt = "crop image "+(idx+1)
      preview.appendChild(img)
      // store data-url for result page temporarily
      localStorage.setItem('latest_image_'+idx, ev.target.result)
    }
    reader.readAsDataURL(file)
  })
  localStorage.setItem('latest_image_count', files.length)
}

if(analyzeBtn){
  analyzeBtn.addEventListener('click', async ()=>{
    const crop = $("cropType").value
  analyzeStatus.textContent = translate('upload.analyzing') || "Analyzing..."
    analyzeBtn.disabled = true
    // Simulate AI processing delay
    await new Promise(r=>setTimeout(r, 1400))
    // Simulated prediction (random demo)
    const diseases = {
      tomato: ["Leaf Blight","Early Blight","Healthy"],
      rice: ["Blast","Bacterial Leaf Blight","Healthy"],
      wheat: ["Rust","Powdery Mildew","Healthy"],
      cotton: ["Wilt","Boll Rot","Healthy"],
      other: ["Unknown Spot","Healthy"]
    }
    const list = diseases[crop] || diseases.other
    const pred = list[Math.floor(Math.random()*list.length)]
    const confidence = Math.floor(75 + Math.random()*23) // 75-97
    const severity = pred==="Healthy" ? "Healthy" : (confidence>90?"Severe":"Mild")
    // Save prediction to localStorage for result page
    const imgCount = parseInt(localStorage.getItem('latest_image_count')||0)
    const images = []
    for(let i=0;i<imgCount;i++){ const d = localStorage.getItem('latest_image_'+i); if(d) images.push(d) }
    const record = {
      id: 'rec_'+Date.now(),
      date: new Date().toISOString(),
      crop,
      disease: pred,
      confidence,
      severity,
      images
    }
    localStorage.setItem('last_record', JSON.stringify(record))
  analyzeStatus.textContent = translate('upload.done_redirect') || "Done. Redirecting to result..."
    setTimeout(()=>{ location.href = "result.html" }, 700)
  })
}

// Result page logic
if($("diseaseName")){
  const rec = JSON.parse(localStorage.getItem('last_record') || null)
  if(rec){
    $("diseaseName").textContent = rec.disease
    $("confidence").textContent = "Confidence: "+rec.confidence+"%"
    $("severity").textContent = "Severity: "+rec.severity
    const imgWrap = $("uploadedImage")
    imgWrap.innerHTML = ""
    if(rec.images && rec.images.length){
      const img = document.createElement('img')
      img.src = rec.images[0]
      img.style.maxWidth = "100%"
      imgWrap.appendChild(img)
  }else imgWrap.textContent = translate('result.no_image') || "No image available"
    const remedyContent = $("remedyContent")
    remedyContent.innerHTML = `
      <p><strong>Organic:</strong> Apply neem-based spray, remove affected leaves.</p>
      <p><strong>Chemical:</strong> Use recommended fungicide/pesticide as per label. Follow safety instructions.</p>
      <p><strong>Preventive:</strong> Crop rotation, proper irrigation, balanced fertilization.</p>
    `
    const preventionList = $("preventionList")
    preventionList.innerHTML = `
      <li>Maintain good drainage</li>
      <li>Avoid overhead irrigation at night</li>
      <li>Use certified seeds</li>
    `
  } else {
    $("diseaseName").textContent = translate('result.no_recent') || "No recent analysis found"
  }

  // Save to dashboard
  $("saveBtn").addEventListener('click', ()=>{
    const recs = JSON.parse(localStorage.getItem('history')||'[]')
    const last = JSON.parse(localStorage.getItem('last_record')||'null')
  if(last){ recs.unshift(last); localStorage.setItem('history', JSON.stringify(recs)); alert(translate('result.saved_dashboard')||'Saved to dashboard') }
  })

  // Download report (simple text-based PDF simulation using blob)
  $("downloadReport").addEventListener('click', ()=>{
    const last = JSON.parse(localStorage.getItem('last_record')||'null')
  if(!last){ alert(translate('result.no_record_download')||'No record to download'); return }
    const text = `Crop Health Analyzer - Report\n\nDate: ${new Date(last.date).toLocaleString()}\nCrop: ${last.crop}\nDisease: ${last.disease}\nConfidence: ${last.confidence}%\nSeverity: ${last.severity}\n`
    const blob = new Blob([text], {type:'text/plain'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'report.txt'; a.click()
    URL.revokeObjectURL(url)
  })

  $("askExpert").addEventListener('click', ()=>{ alert(translate('result.ask_expert')||'Contact form in Contact page for expert help (demo)') })
}

// Dashboard logic
if($("historyList")){
  const historyList = $("historyList")
  function renderHistory(){
    const recs = JSON.parse(localStorage.getItem('history')||'[]')
  if(recs.length===0) historyList.innerHTML = translate('dashboard.empty_history') || "<p>No saved analyses yet.</p>"
    else{
      historyList.innerHTML = ""
      recs.forEach(r=>{
        const div = document.createElement('div'); div.className='item'
        div.innerHTML = `<div>
          <strong>${r.crop} — ${r.disease}</strong><div class="muted">${new Date(r.date).toLocaleString()}</div>
        </div>
        <div>
          <button onclick="viewRecord('${r.id}')" class="btn alt">View</button>
          <button onclick="deleteRecord('${r.id}')" class="btn">Delete</button>
        </div>`
        historyList.appendChild(div)
      })
    }
    // simple analytics
    const analytics = document.getElementById('analytics')
    const ag = {}
    JSON.parse(localStorage.getItem('history')||'[]').forEach(x=>ag[x.disease]=(ag[x.disease]||0)+1)
    analytics.innerHTML = '<pre>'+JSON.stringify(ag,null,2)+'</pre>'
  }
  window.viewRecord = function(id){
    const recs = JSON.parse(localStorage.getItem('history')||'[]')
    const r = recs.find(x=>x.id===id)
    if(r){ localStorage.setItem('last_record', JSON.stringify(r)); location.href='result.html' }
  }
  window.deleteRecord = function(id){
    let recs = JSON.parse(localStorage.getItem('history')||'[]')
    recs = recs.filter(x=>x.id!==id)
    localStorage.setItem('history', JSON.stringify(recs))
    renderHistory()
  }
  $("clearHistory").addEventListener('click', ()=>{ if(confirm('Clear all history?')){ localStorage.removeItem('history'); renderHistory() } })
  renderHistory()
}

// Contact form
if($("sendContact")){
  $("sendContact").addEventListener('click', ()=>{
    const name = $("contactName").value, email=$("contactEmail").value, msg=$("contactMessage").value
    if(!name||!email||!msg){ alert('Please fill all fields'); return }
    alert('Message sent (demo). We will contact you.')
    $("contactForm").reset()
  })
}

// Basic voice guide
if($("voiceGuide")){
  const vgBtn = $("voiceGuide")
  vgBtn.addEventListener('click', ()=>{
    // Determine context-sensitive message based on current page
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase()
    let msg = 'Welcome to Crop Health Analyzer. Click Upload to submit images of your crops. Then press Analyze for diagnosis.'
    if(page.includes('upload')){
      msg = 'Upload page: Choose clear close-up photos of the affected area. Use the crop selector, then press Analyze. For voice diagnosis, use the voice box below or type your symptoms.'
    } else if(page.includes('soil')){
      msg = 'Soil Health Scanner: Upload a soil photo to estimate color and likely nutrient issues, or use Simulate Sensor to produce moisture, pH or nutrient estimates.'
    } else if(page.includes('forum')){
      msg = 'Community Forum: Post a title and detailed description, attach an image if available. The community and AI will auto-tag and suggest remedies.'
    } else if(page.includes('chatbot')){
      msg = 'Fertilizer and Irrigation Advisor: Ask practical questions such as how much fertilizer per acre or when to water. Choose the language and include crop and area for better replies.'
    } else if(page.includes('kb')){
      msg = 'Knowledge Base: Search symptoms, filters by crop and season, and open topics for details and read-aloud.'
    }
    const s = new SpeechSynthesisUtterance(msg)
    speechSynthesis.speak(s)
    // brief visual indicator while speaking
    vgBtn.setAttribute('data-speaking','true')
    setTimeout(()=>vgBtn.removeAttribute('data-speaking'), 2400)
  })
  // double-click stops speech and shows feedback
  vgBtn.addEventListener('dblclick', ()=>{
    if('speechSynthesis' in window){ speechSynthesis.cancel(); vgBtn.setAttribute('data-stopped','true'); setTimeout(()=>vgBtn.removeAttribute('data-stopped'),800) }
  })
}

// Universal topnav active link highlighting and accessible voice guide fallback
window.addEventListener('DOMContentLoaded', ()=>{
  try{
    const navBtns = document.querySelectorAll('.top-nav .nav-btn')
    const path = location.pathname.split('/').pop() || 'index.html'
    navBtns.forEach(a=>{
      const href = a.getAttribute('href')
      if(href && href.includes(path)) a.classList.add('active')
      else a.classList.remove('active')
    })
    // also highlight auth buttons when they point to current page (Sign in / Sign up / Admin)
    const authBtns = document.querySelectorAll('.topbar .auth .btn, .top-nav .nav-btn.admin')
    authBtns.forEach(b=>{
      const href = b.getAttribute('href')
      if(href && href.includes(path)) b.classList.add('active')
      else b.classList.remove('active')
    })
    // ensure voice guide exists in header for accessibility
    if(!document.getElementById('voiceGuide')){
      const vg = document.createElement('button'); vg.id='voiceGuide'; vg.className='btn alt'; vg.textContent='🔊 Voice Guide';
      vg.addEventListener('click', ()=>{ const s = new SpeechSynthesisUtterance('Welcome to Crop Health Analyzer. Click Upload to submit images of your crops. Then press Analyze for diagnosis.'); speechSynthesis.speak(s) })
      // double-click stops speech and gives visual feedback
      vg.addEventListener('dblclick', ()=>{
        if('speechSynthesis' in window){ speechSynthesis.cancel(); vg.setAttribute('data-stopped','true'); setTimeout(()=>vg.removeAttribute('data-stopped'),800) }
      })
      // append to header auth area if present, else to topbar
      const auth = document.querySelector('.topbar .auth')
      if(auth) auth.appendChild(vg)
      else document.querySelector('.topbar').appendChild(vg)
    }
    // add language selector (persisted in localStorage)
    if(!document.getElementById('langSelect')){
      const langs = {
        en: 'English',
        hi: 'हिन्दी',
        bn: 'বাংলা',
        te: 'తెలుగు',
        kn: 'ಕನ್ನಡ',
        ta: 'தமிழ்'
      }
      const sel = document.createElement('select'); sel.id='langSelect'; sel.className='lang-select'
      Object.keys(langs).forEach(k=>{ const opt=document.createElement('option'); opt.value=k; opt.textContent=langs[k]; sel.appendChild(opt) })
  // restore saved (fallback if saved language was removed)
  const saved = localStorage.getItem('cha_lang')||'en'
  sel.value = Object.keys(langs).includes(saved) ? saved : 'en'
  sel.addEventListener('change', ()=>{ localStorage.setItem('cha_lang', sel.value); applyTranslations(sel.value) })
      const auth = document.querySelector('.topbar .auth') || document.querySelector('.topbar')
  if(auth) auth.insertBefore(sel, auth.firstChild)
  applyTranslations(sel.value)
    }
  }catch(e){console.warn('nav highlight error', e)}
})

// small translation map for nav/auth labels
function applyTranslations(code){
  const t = I18N[code] || I18N['en']

  // Translate elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n')
    if(!t[key]) return
    // If element contains interactive children (input/select/textarea/button/img),
    // avoid replacing innerHTML because that would remove those children (e.g., file inputs).
    if(el.querySelector('input,select,textarea,button,img')){
      // Replace the first text node inside the element, or prepend a text node if none.
      const textNode = Array.from(el.childNodes).find(n=>n.nodeType===3)
      if(textNode) textNode.nodeValue = t[key]
      else el.insertBefore(document.createTextNode(t[key]), el.firstChild)
    } else {
      // Safe to replace innerHTML for simple containers (headings, divs, spans)
      el.innerHTML = t[key]
    }
  })
  // Translate placeholders via data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder')
    if(t[key]) el.setAttribute('placeholder', t[key])
  })
  // Translate select option text where options have data-i18n
  document.querySelectorAll('select option[data-i18n]').forEach(opt=>{
    const key = opt.getAttribute('data-i18n')
    if(t[key]) opt.textContent = t[key]
  })

  // Fallback: translate some common topbar elements if still using textContent keys
  // nav links and auth buttons (by their data-i18n if present, else by text match)
  document.querySelectorAll('.top-nav .nav-btn').forEach(a=>{
    const key = a.getAttribute('data-i18n')
    if(key && t[key]) a.textContent = t[key]
    else{
      const txt = a.textContent.trim()
      if(t[txt]) a.textContent = t[txt]
    }
  })
  document.querySelectorAll('.topbar .auth .btn').forEach(b=>{
    const key = b.getAttribute('data-i18n')
    if(key && t[key]) b.textContent = t[key]
    else{
      const txt = b.textContent.trim()
      if(t[txt]) b.textContent = t[txt]
    }
  })
  // voice guide label handling
  const vg = document.getElementById('voiceGuide'); if(vg){ const key = vg.getAttribute('data-i18n')||'voice.guide'; if(t[key]) vg.textContent = t[key] }
}

// Knowledge Base interactions: search, tags, accordion
function initKB(){
  const search = document.getElementById('kbSearch')
  const tags = Array.from(document.querySelectorAll('.kb-tags .tag'))
  const filterCrop = document.getElementById('filterCrop')
  const filterType = document.getElementById('filterType')
  const filterSeason = document.getElementById('filterSeason')
  const items = Array.from(document.querySelectorAll('.kb-item'))

  function filterItems(){
    const q = search ? search.value.trim().toLowerCase() : ''
    const activeTag = tags.find(t=>t.classList.contains('active'))
    const tag = activeTag ? activeTag.dataset.tag : 'all'
    items.forEach(it=>{
      const text = it.textContent.toLowerCase()
      const matchesQ = !q || text.includes(q)
      const matchesTag = tag==='all' || (it.dataset.tags||'').split(',').includes(tag)
      it.style.display = (matchesQ && matchesTag) ? '' : 'none'
    })
  }

  if(search){ search.addEventListener('input', filterItems) }
  tags.forEach(t=>t.addEventListener('click', ()=>{ tags.forEach(x=>x.classList.remove('active')); t.classList.add('active'); filterItems() }))
  if(filterCrop) filterCrop.addEventListener('change', filterItems)
  if(filterType) filterType.addEventListener('change', filterItems)
  if(filterSeason) filterSeason.addEventListener('change', filterItems)

  // accordion
  const kbContent = document.querySelector('.kb-content')
  function setCropClass(name){
    if(!kbContent) return
    // remove previous crop- classes
    Array.from(kbContent.classList).forEach(c=>{ if(c.startsWith('crop-')) kbContent.classList.remove(c) })
    if(name && name!=='all') kbContent.classList.add('crop-'+name)
  }

  document.querySelectorAll('.kb-question').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const a = btn.nextElementSibling
      const open = getComputedStyle(a).display !== 'none'
      document.querySelectorAll('.kb-answer').forEach(x=>x.style.display='none')
      a.style.display = open ? 'none' : 'block'
      // when opening an item, set the crop-* class based on data-crop
      const parent = btn.closest('.kb-item')
      const crop = parent ? parent.dataset.crop : null
      setCropClass(crop)
    })
  })

  // Read aloud buttons
  function readText(text){
    if(!('speechSynthesis' in window)){ alert('Speech synthesis not supported in this browser') ; return }
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.95
    speechSynthesis.cancel(); speechSynthesis.speak(u)
  }
  document.querySelectorAll('.read-aloud').forEach(btn=>{
    // single click: read text
    btn.addEventListener('click', ()=>{
      const parent = btn.closest('.kb-answer')
      const text = parent.innerText.replace(/\n\s*/g,' ') 
      readText(text)
    })
    // double click: stop speaking
    btn.addEventListener('dblclick', ()=>{
      if('speechSynthesis' in window){
        speechSynthesis.cancel()
        // provide a brief visual feedback by toggling an attribute
        btn.setAttribute('data-stopped','true')
        setTimeout(()=>btn.removeAttribute('data-stopped'), 800)
      }
    })
  })
  // when crop filter changes, apply class for tinting
  if(filterCrop) filterCrop.addEventListener('change', ()=>{ setCropClass(filterCrop.value) })
  // on init, apply current filter value so tint shows immediately
  if(filterCrop && filterCrop.value) setCropClass(filterCrop.value)
}

if(document.getElementById('kbList')) initKB()
