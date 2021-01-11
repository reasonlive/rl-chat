const countries = `[{"country":{"en":"Abkhazia","ru":"Абхазия"},"capital":{"en":"Sukhum(i)","ru":"Сухум"}},{"country":{"en":"Afghanistan","ru":"Афганистан"},"capital":{"en":"Kabul","ru":"Кабул"}},{"country":{"en":"Albania","ru":"Албания"},"capital":{"en":"Tirana","ru":"Тирана"}},{"country":{"en":"Algeria","ru":"Алжир"},"capital":{"en":"Algiers","ru":"Алжир"}},{"country":{"en":"Argentina","ru":"Аргентина"},"capital":{"en":"Buenos Aires","ru":"Буэнос-Айрес"}},{"country":{"en":"Armenia","ru":"Армения"},"capital":{"en":"Yerevan","ru":"Ереван"}},{"country":{"en":"Australia","ru":"Австралия"},"capital":{"en":"Canberra","ru":"Канберра"}},{"country":{"en":"Austria","ru":"Австрия"},"capital":{"en":"Vienna","ru":"Вена"}},{"country":{"en":"Azerbaijan","ru":"Азербайджан"},"capital":{"en":"Baku","ru":"Баку"}},{"country":{"en":"Bahamas","ru":"Багамские о-ва"},"capital":{"en":"Nassau","ru":"Нассау"}},{"country":{"en":"Bahrain","ru":"Бахрейн"},"capital":{"en":"Manama","ru":"Манама"}},{"country":{"en":"Bangladesh","ru":"Бангладеш"},"capital":{"en":"Dacca","ru":"Дакка"}},{"country":{"en":"Belarus","ru":"Беларусь"},"capital":{"en":"Minsk","ru":"Минск"}},{"country":{"en":"Belgium","ru":"Бельгия"},"capital":{"en":"Brussels","ru":"Брюссель"}},{"country":{"en":"Bermuda Islands","ru":"Бермудские о-ва"},"capital":{"en":"Hamilton","ru":"Гамильтон"}},{"country":{"en":"Bolivia","ru":"Боливия"},"capital":{"en":"La Paz","ru":"Ла-Пас"}},{"country":{"en":"Brazil","ru":"Бразилия"},"capital":{"en":"Brasilia","ru":"Бразилиа"}},{"country":{"en":"Bulgaria","ru":"Болгария"},"capital":{"en":"Sofia","ru":"София"}},{"country":{"en":"Burundi","ru":"Бурунди"},"capital":{"en":"Bujumbura","ru":"Бужумбура"}},{"country":{"en":"Cambodia","ru":"Камбоджа"},"capital":{"en":"Pnompenh","ru":"Пномпень"}},{"country":{"en":"Cameroon","ru":"Камерун"},"capital":{"en":"Yaounde","ru":"Яунде"}},{"country":{"en":"Canada","ru":"Канада"},"capital":{"en":"Ottawa","ru":"Оттава"}},{"country":{"en":"Chile","ru":"Чили"},"capital":{"en":"Santiago","ru":"Сантьяго"}},{"country":{"en":"China","ru":"Китай"},"capital":{"en":"Beijing / Peking","ru":"Пекин"}},{"country":{"en":"Colombia","ru":"Колумбия"},"capital":{"en":"Bogota","ru":"Богота"}},{"country":{"en":"Congo","ru":"Конго"},"capital":{"en":"Brazzaville","ru":"Браззавиль"}},{"country":{"en":"Costa Rica","ru":"Коста-Рика"},"capital":{"en":"San Jose","ru":"Сан-Хосе"}},{"country":{"en":"Cuba","ru":"Куба"},"capital":{"en":"Havana","ru":"Гавана"}},{"country":{"en":"Cyprus","ru":"Кипр"},"capital":{"en":"Nicosia","ru":"Никосия"}},{"country":{"en":"Czech Republic","ru":"Чехия"},"capital":{"en":"Prague","ru":"Прага"}},{"country":{"en":"Denmark","ru":"Дания"},"capital":{"en":"Copenhagen","ru":"Копенгаген"}},{"country":{"en":"Dominican Republic","ru":"Доминиканская Республика"},"capital":{"en":"Santo Domingo","ru":"Санто-Доминго"}},{"country":{"en":"Ecuador","ru":"Эквадор"},"capital":{"en":"Quito","ru":"Кито"}},{"country":{"en":"Egypt","ru":"Египет"},"capital":{"en":"Cairo","ru":"Каир"}},{"country":{"en":"El Salvador","ru":"Сальвадор"},"capital":{"en":"San Salvador","ru":"Сан-Сальвадор"}},{"country":{"en":"Estonia","ru":"Эстония"},"capital":{"en":"Tallinn","ru":"Таллинн"}},{"country":{"en":"Ethiopia","ru":"Эфиопия"},"capital":{"en":"Addis Ababa","ru":"Аддис-Абеба"}},{"country":{"en":"Finland","ru":"Финляндия"},"capital":{"en":"Helsinki","ru":"Хельсинки"}},{"country":{"en":"France","ru":"Франция"},"capital":{"en":"Paris","ru":"Париж"}},{"country":{"en":"Georgia","ru":"Грузия"},"capital":{"en":"Tbilisi","ru":"Тбилиси"}},{"country":{"en":"Germany","ru":"Германия"},"capital":{"en":"Berlin","ru":"Берлин"}},{"country":{"en":"Ghana","ru":"Гана"},"capital":{"en":"Accra","ru":"Аккра"}},{"country":{"en":"Gibraltar","ru":"Гибралтар"},"capital":{"en":"Gibraltar Town","ru":"Гибралтар"}},{"country":{"en":"Great Britain / United Kingdom","ru":"Великобритания / Соединенное королевство"},"capital":{"en":"London","ru":"Лондон"}},{"country":{"en":"Greece","ru":"Греция"},"capital":{"en":"Athens","ru":"Афины"}},{"country":{"en":"Guatemala","ru":"Гватемала"},"capital":{"en":"Guatemala City","ru":"Гватемала"}},{"country":{"en":"Guinea","ru":"Гвинея"},"capital":{"en":"Conakry","ru":"Конакри"}},{"country":{"en":"Haiti","ru":"Гаити"},"capital":{"en":"Port-au-Prince","ru":"Порт-о-Пренс"}},{"country":{"en":"Hawaii","ru":"Гавайи"},"capital":{"en":"Honolulu","ru":"Гонолулу"}},{"country":{"en":"Honduras","ru":"Гондурас"},"capital":{"en":"Tegucigalpa","ru":"Тегусигальпа"}},{"country":{"en":"Hong Kong","ru":"Гонконг"},"capital":{"en":"Hong Kong","ru":"Гонконг"}},{"country":{"en":"Hungary","ru":"Венгрия"},"capital":{"en":"Budapest","ru":"Будапешт"}},{"country":{"en":"Iceland","ru":"Исландия"},"capital":{"en":"Reykjavik","ru":"Рейкьявик"}},{"country":{"en":"India","ru":"Индия"},"capital":{"en":"New Delhi","ru":"Нью-Дели"}},{"country":{"en":"Indonesia","ru":"Индонезия"},"capital":{"en":"Jakarta","ru":"Джакарта"}},{"country":{"en":"Iran","ru":"Иран"},"capital":{"en":"Tehran","ru":"Тегеран"}},{"country":{"en":"Iraq","ru":"Ирак"},"capital":{"en":"Baghdad","ru":"Багдад"}},{"country":{"en":"Ireland","ru":"Ирландия"},"capital":{"en":"Dublin","ru":"Дублин"}},{"country":{"en":"Israel","ru":"Израиль"},"capital":{"en":"Jerusalem","ru":"Иерусалим"}},{"country":{"en":"Italy","ru":"Италия"},"capital":{"en":"Rome","ru":"Рим"}},{"country":{"en":"Ivory Coast","ru":"Берег Слоновой Кости"},"capital":{"en":"Abidjan","ru":"Абиджан"}},{"country":{"en":"Jamaica","ru":"Ямайка"},"capital":{"en":"Kingston","ru":"Кингстон"}},{"country":{"en":"Japan","ru":"Япония"},"capital":{"en":"Tokyo","ru":"Токио"}},{"country":{"en":"Kazakhstan","ru":"Казахстан"},"capital":{"en":"Astana","ru":"Астана"}},{"country":{"en":"Kenya","ru":"Кения"},"capital":{"en":"Nairobi","ru":"Найроби"}},{"country":{"en":"Kuwait","ru":"Кувейт"},"capital":{"en":"Kuwait City","ru":"Кувейт"}},{"country":{"en":"Kyrgyzstan","ru":"Киргизия"},"capital":{"en":"Bishkek","ru":"Бишкек"}},{"country":{"en":"Latvia","ru":"Латвия"},"capital":{"en":"Riga","ru":"Рига"}},{"country":{"en":"Lebanon","ru":"Ливан"},"capital":{"en":"Beirut","ru":"Бейрут"}},{"country":{"en":"Liberia","ru":"Либерия"},"capital":{"en":"Monrovia","ru":"Монровия"}},{"country":{"en":"Libya","ru":"Ливия"},"capital":{"en":"Tripoli","ru":"Триполи"}},{"country":{"en":"Lithuania","ru":"Литва"},"capital":{"en":"Vilnius","ru":"Вильнюс"}},{"country":{"en":"Luxemburg","ru":"Люксембург"},"capital":{"en":"Luxemburg","ru":"Люксембург"}},{"country":{"en":"Madagascar","ru":"Мадагаскар"},"capital":{"en":"Antananarivo","ru":"Антананариву"}},{"country":{"en":"Malawi","ru":"Малави"},"capital":{"en":"Lilongwe","ru":"Лилонгве"}},{"country":{"en":"Malaysia","ru":"Малайзия"},"capital":{"en":"Kuala Lumpur","ru":"Куала-Лумпур"}},{"country":{"en":"Malta","ru":"Мальта"},"capital":{"en":"Valletta","ru":"(Ла-)Валлетта"}},{"country":{"en":"Mexico","ru":"Мексика"},"capital":{"en":"Mexico City","ru":"Мехико"}},{"country":{"en":"Moldova","ru":"Молдавия"},"capital":{"en":"Chisinau (Kishinev)","ru":"Кишинев"}},{"country":{"en":"Monaco","ru":"Монако"},"capital":{"en":"Monaco-Ville","ru":"Монако-Вилль"}},{"country":{"en":"Mongolia","ru":"Монголия"},"capital":{"en":"Ulan Bator","ru":"Улан-Батор"}},{"country":{"en":"Morocco","ru":"Марокко"},"capital":{"en":"Rabat","ru":"Рабат"}},{"country":{"en":"Nepal","ru":"Непал"},"capital":{"en":"Kathmandu","ru":"Катманду"}},{"country":{"en":"Netherlands / Holland","ru":"Нидерланды / Голландия"},"capital":{"en":"Amsterdam","ru":"Амстердам"}},{"country":{"en":"New Zeland","ru":"Новая Зеландия"},"capital":{"en":"Wellington","ru":"Веллингтон"}},{"country":{"en":"Nicaragua","ru":"Никарагуа"},"capital":{"en":"Managua","ru":"Манагуа"}},{"country":{"en":"Nigeria","ru":"Нигерия"},"capital":{"en":"Lagos","ru":"Лагос"}},{"country":{"en":"North Korea","ru":"Северная Корея"},"capital":{"en":"Pyongyang","ru":"Пхеньян"}},{"country":{"en":"Norway","ru":"Норвегия"},"capital":{"en":"Oslo","ru":"Осло"}},{"country":{"en":"Oman","ru":"Оман"},"capital":{"en":"Muscat","ru":"Мускат"}},{"country":{"en":"Pakistan","ru":"Пакистан"},"capital":{"en":"Islamabad","ru":"Исламабад"}},{"country":{"en":"Panama","ru":"Панама"},"capital":{"en":"Panama City","ru":"Панама-Сити"}},{"country":{"en":"Papua New Guinea","ru":"Папуа — Новая Гвинея"},"capital":{"en":"Port Moresby","ru":"Порт-Морсби"}},{"country":{"en":"Paraguay","ru":"Парагвай"},"capital":{"en":"Asuncion","ru":"Асунсьон"}},{"country":{"en":"Peru","ru":"Перу"},"capital":{"en":"Lima","ru":"Лима"}},{"country":{"en":"Philippines","ru":"Филиппины"},"capital":{"en":"Manila","ru":"Манила"}},{"country":{"en":"Poland","ru":"Польша"},"capital":{"en":"Warsaw","ru":"Варшава"}},{"country":{"en":"Portugal","ru":"Португалия"},"capital":{"en":"Lisbon","ru":"Лиссабон"}},{"country":{"en":"Puerto Rico","ru":"Пуэрто-Рико"},"capital":{"en":"San Juan","ru":"Сан-Хуан"}},{"country":{"en":"Romania","ru":"Румыния"},"capital":{"en":"Bucharest","ru":"Бухарест"}},{"country":{"en":"Russia","ru":"Россия"},"capital":{"en":"Moscow","ru":"Москва"}},{"country":{"en":"Rwanda","ru":"Руанда"},"capital":{"en":"Kigali","ru":"Кигали"}},{"country":{"en":"Saudi Arabia","ru":"Саудовская Аравия"},"capital":{"en":"Riyadh","ru":"Эр-Рияд"}},{"country":{"en":"Senegal","ru":"Сенегал"},"capital":{"en":"Dakar","ru":"Дакар"}},{"country":{"en":"Sierra Leone","ru":"Сьерра-Леоне"},"capital":{"en":"Freetown","ru":"Фритаун"}},{"country":{"en":"Singapore","ru":"Сингапур"},"capital":{"en":"Singapore City","ru":"Сингапур"}},{"country":{"en":"Slovakia","ru":"Словакия"},"capital":{"en":"Bratislava","ru":"Братислава"}},{"country":{"en":"Slovenia","ru":"Словения"},"capital":{"en":"Ljubljana","ru":"Любляна"}},{"country":{"en":"South Africa","ru":"Южная Африка"},"capital":{"en":"Pretoria","ru":"Претория"}},{"country":{"en":"South Korea","ru":"Южная Корея"},"capital":{"en":"Seoul","ru":"Сеул"}},{"country":{"en":"South Ossetia","ru":"Южная Осетия"},"capital":{"en":"Tskhinval(i)","ru":"Цхинвал(и)"}},{"country":{"en":"Spain","ru":"Испания"},"capital":{"en":"Madrid","ru":"Мадрид"}},{"country":{"en":"Sri Lanka","ru":"Шри-Ланка"},"capital":{"en":"Colombo","ru":"Коломбо"}},{"country":{"en":"Sudan","ru":"Судан"},"capital":{"en":"Khartoum","ru":"Хартум"}},{"country":{"en":"Sweden","ru":"Швеция"},"capital":{"en":"Stockholm","ru":"Стокгольм"}},{"country":{"en":"Switzerland","ru":"Швейцария"},"capital":{"en":"Berne","ru":"Берн"}},{"country":{"en":"Syria","ru":"Сирия"},"capital":{"en":"Damascus","ru":"Дамаск"}},{"country":{"en":"Taiwan","ru":"Тайвань"},"capital":{"en":"Taipei","ru":"Тайбэй"}},{"country":{"en":"Tajikistan","ru":"Таджикистан"},"capital":{"en":"Dushanbe","ru":"Душанбе"}},{"country":{"en":"Thailand","ru":"Таиланд"},"capital":{"en":"Bangkok","ru":"Бангкок"}},{"country":{"en":"Togo","ru":"Того"},"capital":{"en":"Lome","ru":"Ломе"}},{"country":{"en":"Tunisia","ru":"Тунис"},"capital":{"en":"Tunis","ru":"Тунис"}},{"country":{"en":"Turkey","ru":"Турция"},"capital":{"en":"Ankara","ru":"Анкара"}},{"country":{"en":"Turkmenistan","ru":"Туркменистан"},"capital":{"en":"Ashgabat","ru":"Ашхабад"}},{"country":{"en":"Uganda","ru":"Уганда"},"capital":{"en":"Kampala","ru":"Кампала"}},{"country":{"en":"Ukraine","ru":"Украина"},"capital":{"en":"Kyiv (Kiev)","ru":"Киев"}},{"country":{"en":"United Arab Emirates","ru":"Объединенные Арабские Эмираты"},"capital":{"en":"Abu Dhabi","ru":"Абу-Даби"}},{"country":{"en":"United States of America / USA","ru":"США"},"capital":{"en":"Washington","ru":"Вашингтон"}},{"country":{"en":"Uruguay","ru":"Уругвай"},"capital":{"en":"Montevideo","ru":"Монтевидео"}},{"country":{"en":"Uzbekistan","ru":"Узбекистан"},"capital":{"en":"Tashkent","ru":"Ташкент"}},{"country":{"en":"Venezuela","ru":"Венесуэла"},"capital":{"en":"Caracas","ru":"Каракас"}},{"country":{"en":"Yemen","ru":"Йемен"},"capital":{"en":"Sana'a","ru":"Сана"}},{"country":{"en":"Zaire","ru":"Заир"},"capital":{"en":"Kinshasa","ru":"Киншаса"}},{"country":{"en":"Zambia","ru":"Замбия"},"capital":{"en":"Lusaka","ru":"Лусака"}},{"country":{"en":"Zimbabwe","ru":"Зимбабве"},"capital":{"en":"Harare","ru":"Хараре"}}]`;

export default countries;