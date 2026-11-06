export const invitationLanguages = [
	{
		code: 'de',
		label: 'Deutsch',
		dir: 'ltr',
		paragraphs: [
			'Nur ein faires Spiel ist ein gutes Spiel, das gilt im Sport, in der Politik und im Leben. Wir präsentieren aus der Aktion „Spielend für Toleranz“ des Vereins „Spiel des Jahres“ und aus eigenen Beständen verschiedene Brett-, Karten und Aktionsspiele, die einfach zu lernen und zu spielen sind.',
			'Auch wer andere Sprachen besser spricht als Deutsch, kann mitmachen!'
		]
	},
	{
		code: 'en',
		label: 'English',
		dir: 'ltr',
		paragraphs: [
			'Only a fair game is a good game - in sport, in politics and in life. We present various board, card and action games that are easy to learn and play from the ‘Playing for Tolerance’ campaign organised by the ‘Game of the Year’ association and from our own stocks.',
			'Even those who speak other languages better than German can take part!'
		]
	},
	{
		code: 'uk',
		label: 'Українська',
		dir: 'ltr',
		paragraphs: [
			'Тільки чесна гра є хорошою грою - в спорті, в політиці та в житті. Ми представляємо різноманітні настільні, карткові та рухливі ігри, які легко вивчити та грати, від кампанії «Граємо за толерантність», організованої асоціацією «Гра року», а також з наших власних запасів.',
			'Навіть ті, хто володіє іншими мовами краще, ніж німецькою, можуть взяти участь!'
		]
	},
	{
		code: 'ar',
		label: 'العربية',
		dir: 'rtl',
		paragraphs: [
			'اللعبة العادلة وحدها هي اللعبة الجيدة - وهي تسري في الرياضة والسياسة والحياة. نقدم من خلال حملة "اللعب من اجل التسامح" لجمعية "لعبة السنة" ومن مجموعتنا الخاصة المتنوعة مثل : ألعاب الطاولة و الاوراق و الألعاب الحركية.',
			'التي من السهل تعلمها وممارستها.',
			'حتى الأشخاص الذين يتحدثون لغة اخرى أفضل من المانية يمكنهم المشاركة أيضآ.'
		]
	},
	{
		code: 'sw',
		label: 'Kiswahili',
		dir: 'ltr',
		paragraphs: [
			'Mchezo wa haki pekee ndio mchezo mzuri katika michezo, siasa, na maisha. Tunawasilisha michezo mbalimbali ya ubao, kadi, na vitendo ambayo ni rahisi kujifunza na kucheza kutoka kampeni ya ‘Kucheza kwa Uvumilivu’ iliyoandaliwa na chama cha ‘Mchezo wa Mwaka’ na pia kutoka kwenye hazina yetu wenyewe.',
			'Hata wale wanaozungumza lugha nyingine vizuri zaidi kuliko Kijerumani wanaweza kushiriki!'
		]
	},
	{
		code: 'hi',
		label: 'हिन्दी',
		dir: 'ltr',
		paragraphs: [
			"केवल एक निष्पक्ष खेल ही एक अच्छा खेल है - खेल में, राजनीति में और जीवन में। हम विभिन्न बोर्ड, कार्ड और एक्शन गेम प्रस्तुत करते हैं जिन्हें सीखना और खेलना आसान है, 'गेम ऑफ़ द ईयर' एसोसिएशन द्वारा आयोजित 'प्लेइंग फ़ॉर टॉलरेंस' अभियान और हमारे अपने सामान से। यहां तक कि जो लोग जर्मन से बेहतर अन्य भाषाएं बोलते हैं वे भी भाग ले सकते हैं!"
		]
	}
] as const;

export type InvitationLanguageCode = (typeof invitationLanguages)[number]['code'];

const supportedLanguages = new Set<string>(invitationLanguages.map((language) => language.code));

export function detectInvitationLanguage(tags: readonly string[]): InvitationLanguageCode {
	for (const tag of tags) {
		const base = tag.toLowerCase().split('-')[0];
		if (base === 'ua') return 'uk';
		if (supportedLanguages.has(base)) return base as InvitationLanguageCode;
	}
	return 'de';
}
