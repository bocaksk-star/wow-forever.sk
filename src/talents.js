// Vlastná (originálna) talentová kalkulačka pre WoW Forever — dáta sú naše zhrnutie
// mechaník klasických talentových stromov (fakty o hre, nie prevzatý text ani ikony Blizzardu).
// Každý strom má 6 tier-ov, odomykajú sa po 5 bodoch investovaných v danom strome (0/5/10/15/20/25).
// Formát talentu: { t: tier (0-5), name, max: maxRank, d: krátky popis efektu }

export const TALENT_TREES = {
  warrior: {
    trees: [
      { key: 'arms', name: 'Zbrane', talents: [
        { t: 0, name: 'Vylepšený Heroic Strike', max: 3, d: 'Znižuje cenu Heroic Strike o 1/2/3 rage.' },
        { t: 0, name: 'Deflection', max: 5, d: '+1 % šanca na parry za rank.' },
        { t: 1, name: 'Taktická zdatnosť', max: 5, d: 'Pri zmene postoja si ponecháš viac rage.' },
        { t: 1, name: 'Vylepšený Charge', max: 2, d: 'Charge dáva o 3/6 rage viac.' },
        { t: 2, name: 'Hlboké rany', max: 3, d: 'Kritické zásahy pridajú krvácanie v priebehu 6 s.' },
        { t: 2, name: 'Majster zbraní', max: 5, d: '+1 % dmg za rank s obojručnými zbraňami.' },
        { t: 3, name: 'Impale', max: 2, d: '+5/10 % poškodenie z kritických zásahov.' },
        { t: 3, name: 'Vylepšený Overpower', max: 2, d: '+25/50 % šanca na crit s Overpower.' },
        { t: 4, name: 'Sweeping Strikes', max: 1, d: 'Ďalší útok automaticky zasiahne aj blízkeho nepriateľa.' },
        { t: 4, name: 'Trauma Vzostup', max: 5, d: '+1 % crit šanca za rank s melee zbraňami.' },
        { t: 5, name: 'Mortal Strike', max: 1, d: 'Silný úder, ktorý na 10 s zníži liečenie cieľa o 50 %.' },
      ] },
      { key: 'fury', name: 'Zúrivosť', talents: [
        { t: 0, name: 'Besnenie', max: 5, d: '+5 % rage generovaná z poškodenia za rank.' },
        { t: 0, name: 'Vylepšený Demoralizing Shout', max: 5, d: 'Silnejší Demoralizing Shout.' },
        { t: 1, name: 'Boj dvoma zbraňami', max: 5, d: '+2 % dmg za rank pri dual-wielde.' },
        { t: 1, name: 'Cruelty', max: 5, d: '+1 % crit šanca za rank.' },
        { t: 2, name: 'Zbesilosť', max: 1, d: 'Zvyšuje rýchlosť útoku na krátky čas po killshote.' },
        { t: 2, name: 'Dual Wield Specialization', max: 5, d: '+2 % dmg z off-hand zbrane za rank.' },
        { t: 3, name: 'Death Wish', max: 1, d: '+20 % fyzický dmg, ale aj dostávané poškodenie, na 30 s.' },
        { t: 3, name: 'Vylepšený Berserker Rage', max: 2, d: 'Berserker Rage dáva aj rage navyše.' },
        { t: 4, name: 'Flurry', max: 5, d: 'Po kritickom zásahu dočasne vyššia rýchlosť útoku.' },
        { t: 4, name: 'Bod bez návratu', max: 3, d: '+3 % šanca na crit v Berserker Stance za rank.' },
        { t: 5, name: 'Zúrivý úder (Whirlwind+)', max: 1, d: 'Silnejší Whirlwind s nižšou cenou rage.' },
      ] },
      { key: 'prot', name: 'Ochrana', talents: [
        { t: 0, name: 'Vylepšený Bloodrage', max: 2, d: 'Bloodrage dáva viac rage a lieči.' },
        { t: 0, name: 'Tuhá koža', max: 5, d: '+2 brnenia za rank zo zbroje.' },
        { t: 1, name: 'Vylepšený Shield Block', max: 3, d: 'Dlhšie trvanie a kratší cooldown Shield Block.' },
        { t: 1, name: 'Anger Management', max: 1, d: 'Automaticky generuje rage v priebehu času.' },
        { t: 2, name: 'Vylepšený Revenge', max: 3, d: 'Revenge má šancu omráčiť cieľ.' },
        { t: 2, name: 'Odolnosť voči kúzlam', max: 5, d: '+1 % odolnosť voči magickým škôlam za rank.' },
        { t: 3, name: 'Shield Slam', max: 1, d: 'Silný úder štítom založený na brnení.' },
        { t: 3, name: 'Vylepšený Shield Wall', max: 2, d: 'Shield Wall má kratší cooldown.' },
        { t: 4, name: 'Druhý dych', max: 1, d: 'Pri omráčení alebo odzbrojení získaš zdravie a rage.' },
        { t: 4, name: 'Vitalita', max: 5, d: '+1 kmeňové zdravie a sila za rank.' },
        { t: 5, name: 'Last Stand', max: 1, d: 'Dočasne o 30 % viac maximálneho zdravia.' },
      ] },
    ],
  },
  paladin: {
    trees: [
      { key: 'holy', name: 'Svetlo', talents: [
        { t: 0, name: 'Spiritual Focus', max: 5, d: 'Šanca neprerušiť liečivé kúzlo pri zásahu.' },
        { t: 0, name: 'Vylepšený Lay on Hands', max: 2, d: 'Kratší cooldown Lay on Hands.' },
        { t: 1, name: 'Zbožnosť', max: 5, d: '+5 % liečivá sila kúziel za rank.' },
        { t: 1, name: 'Vylepšený Holy Light', max: 3, d: 'Rýchlejšie zoslanie Holy Light.' },
        { t: 2, name: 'Unyielding Faith', max: 2, d: 'Vyššia odolnosť voči strachu a uspávaniu.' },
        { t: 2, name: 'Illumination', max: 5, d: 'Kritické liečenie vráti časť many.' },
        { t: 3, name: 'Svätá sila', max: 5, d: '+1 % crit šanca liečivých kúziel za rank.' },
        { t: 3, name: 'Vylepšený Blessing of Wisdom', max: 2, d: 'Blessing of Wisdom vracia viac many.' },
        { t: 4, name: 'Holy Shock', max: 1, d: 'Okamžité liečivé alebo útočné kúzlo svetla.' },
        { t: 5, name: 'Svätý šok Mastery', max: 3, d: 'Nižší cooldown a cena Holy Shock.' },
      ] },
      { key: 'prot', name: 'Ochrana', talents: [
        { t: 0, name: 'Redoubt', max: 5, d: 'Po bloku dočasne vyššia šanca na blok.' },
        { t: 0, name: 'Precision', max: 3, d: '+1 % šanca na zásah za rank.' },
        { t: 1, name: 'Toughness', max: 5, d: '+2 % brnenie zo zbroje za rank.' },
        { t: 1, name: 'Blessing of Kings', max: 1, d: 'Nové požehnanie: +10 % ku všetkým atribútom.' },
        { t: 2, name: 'Vylepšený Righteous Fury', max: 3, d: 'Vyšší threat z Righteous Fury.' },
        { t: 2, name: 'Vylepšený Hammer of Justice', max: 2, d: 'Dlhší omračujúci efekt.' },
        { t: 3, name: 'Guardian\'s Favor', max: 2, d: 'Dlhší dosah a kratší cooldown Hand of Freedom/Protection.' },
        { t: 3, name: 'Shield Specialization', max: 5, d: '+1 % šanca na blok za rank.' },
        { t: 4, name: 'Holy Shield', max: 1, d: 'Zvyšuje šancu na blok a poškodzuje útočníka pri blokovaní.' },
        { t: 5, name: 'Vylepšený Righteousness', max: 3, d: 'Silnejšie základné útoky so štítom.' },
      ] },
      { key: 'ret', name: 'Odplata', talents: [
        { t: 0, name: 'Benediction', max: 5, d: '-10 % cena many kúziel za rank.' },
        { t: 0, name: 'Vylepšený Blessing of Might', max: 5, d: 'Silnejšie Blessing of Might.' },
        { t: 1, name: 'Deflection (Pal)', max: 5, d: '+1 % šanca na parry za rank.' },
        { t: 1, name: 'Vylepšený Judgement', max: 3, d: 'Kratší cooldown Judgement.' },
        { t: 2, name: 'Horúca krv', max: 1, d: '+40 % šanca na crit na krátky čas po úhybe/parry.' },
        { t: 2, name: 'Zbraňová zdatnosť (Pal)', max: 5, d: '+1 % dmg zbraňou za rank.' },
        { t: 3, name: 'Vindication', max: 3, d: 'Útoky dočasne znížia silu/útok nepriateľa.' },
        { t: 3, name: 'Svätý štít pomsty', max: 3, d: '+1 % crit šanca za rank s melee aj kúzlami.' },
        { t: 4, name: 'Seal of Command', max: 1, d: 'Nová pečať: šanca na extra úder pri každom zásahu.' },
        { t: 5, name: 'Repentance', max: 1, d: 'Uspí nepriateľa na niekoľko sekúnd.' },
      ] },
    ],
  },
  hunter: {
    trees: [
      { key: 'bm', name: 'Beast Mastery', talents: [
        { t: 0, name: 'Vylepšený Aspect of the Hawk', max: 5, d: 'Silnejší Aspect of the Hawk.' },
        { t: 0, name: 'Bestiálna zúrivosť', max: 1, d: 'Pet dočasne spôsobuje viac poškodenia.' },
        { t: 1, name: 'Zvieracie pokrvenstvo', max: 5, d: '+2 % zdravie peta za rank.' },
        { t: 1, name: 'Frenzy', max: 5, d: 'Pet má po kritickom zásahu vyššiu rýchlosť útoku.' },
        { t: 2, name: 'Vylepšený Mend Pet', max: 3, d: 'Mend Pet lieči viac a nemôže byť prerušený.' },
        { t: 2, name: 'Thick Hide', max: 3, d: '+2 % brnenie peta za rank.' },
        { t: 3, name: 'Pokrokový tréning peta', max: 1, d: 'Pet získa nové aktívne schopnosti.' },
        { t: 3, name: 'Bestiálna odolnosť', max: 5, d: '-2 % poškodenie od kúziel na peta za rank.' },
        { t: 4, name: 'Intimidation', max: 1, d: 'Pet omráči cieľ a zvýši jeho threat.' },
        { t: 5, name: 'Bestial Wrath', max: 1, d: 'Pet na 18 s spôsobuje oveľa viac dmg a je imúnny voči CC.' },
      ] },
      { key: 'mm', name: 'Marksmanship', talents: [
        { t: 0, name: 'Vylepšený Concussive Shot', max: 2, d: 'Dlhší spomaľujúci efekt.' },
        { t: 0, name: 'Efficiency', max: 5, d: '-1 % cena many/sústredenia za rank.' },
        { t: 1, name: 'Vylepšený Hunter\'s Mark', max: 3, d: 'Hunter\'s Mark pridáva aj crit šancu.' },
        { t: 1, name: 'Zameranie', max: 5, d: 'Rýchlejšia regenerácia sústredenia.' },
        { t: 2, name: 'Vylepšený Arcane Shot', max: 3, d: 'Nižšia cena Arcane Shot.' },
        { t: 2, name: 'Rýchla ruka', max: 2, d: 'Rýchlejšie opätovné nabitie zbrane.' },
        { t: 3, name: 'Mortal Shots', max: 5, d: '+6 % crit poškodenie streľbou za rank.' },
        { t: 3, name: 'Vylepšený Serpent Sting', max: 3, d: 'Serpent Sting pôsobí dlhšie.' },
        { t: 4, name: 'Trueshot Aura', max: 1, d: 'Aura zvyšujúca útočnú silu celej skupine.' },
        { t: 5, name: 'Aimed Shot', max: 1, d: 'Silný presný výstrel s vysokým poškodením.' },
      ] },
      { key: 'surv', name: 'Prežitie', talents: [
        { t: 0, name: 'Pevné svaly', max: 5, d: '+2 % odolnosť voči uspatiu za rank.' },
        { t: 0, name: 'Vylepšený Wing Clip', max: 2, d: 'Vyššia šanca spomalenia s Wing Clip.' },
        { t: 1, name: 'Delenie zranení', max: 1, d: 'Pri boji na blízko spôsobuješ aj menší ranged dmg.' },
        { t: 1, name: 'Vylepšený Freezing Trap', max: 2, d: 'Dlhšie trvanie Freezing Trap.' },
        { t: 2, name: 'Deterrence', max: 1, d: 'Dočasne vysoká šanca na úhyb a parry.' },
        { t: 2, name: 'Survivalist', max: 5, d: '+2 % maximálne zdravie za rank.' },
        { t: 3, name: 'Vylepšený Feign Death', max: 2, d: 'Vyššia šanca na úspech Feign Death.' },
        { t: 3, name: 'Zberateľ pascí', max: 2, d: 'Pasce majú kratší cooldown.' },
        { t: 4, name: 'Vylepšený Wing Clip+', max: 1, d: 'Wing Clip má šancu neminúť cieľ.' },
        { t: 5, name: 'Counterattack', max: 1, d: 'Po úhybe získaš silný protiútok.' },
      ] },
    ],
  },
  rogue: {
    trees: [
      { key: 'assa', name: 'Zabijactvo', talents: [
        { t: 0, name: 'Vylepšený Eviscerate', max: 5, d: '+ poškodenie Eviscerate za rank.' },
        { t: 0, name: 'Malice', max: 5, d: '+1 % crit šanca za rank.' },
        { t: 1, name: 'Zákerné útoky', max: 5, d: '+2 % dmg na omráčené/uspaté ciele za rank.' },
        { t: 1, name: 'Vylepšený Slice and Dice', max: 3, d: 'Slice and Dice trvá dlhšie.' },
        { t: 2, name: 'Zabijacký inštinkt', max: 5, d: '+1 % crit šanca za rank.' },
        { t: 2, name: 'Vylepšený Expose Armor', max: 2, d: 'Expose Armor znižuje viac brnenia.' },
        { t: 3, name: 'Cold Blood', max: 1, d: 'Ďalší útok je zaručene kritický.' },
        { t: 3, name: 'Improved Poisons', max: 4, d: '+4 % šanca na aplikáciu jedu za rank.' },
        { t: 4, name: 'Vigor', max: 1, d: '+maximálna energia.' },
        { t: 5, name: 'Seal Fate', max: 5, d: 'Kritické kombo body dávajú extra combo point.' },
      ] },
      { key: 'combat', name: 'Boj', talents: [
        { t: 0, name: 'Vylepšený Sinister Strike', max: 3, d: '-cena energie Sinister Strike.' },
        { t: 0, name: 'Precision (R)', max: 5, d: '+1 % šanca na zásah za rank.' },
        { t: 1, name: 'Zbraňová zdatnosť', max: 5, d: '+1 % dmg s dýkami/mečmi/palicami za rank.' },
        { t: 1, name: 'Vylepšený Sprint', max: 2, d: 'Kratší cooldown Sprint.' },
        { t: 2, name: 'Zbraňové majstrovstvo', max: 3, d: '+1 % dmg zbraňou za rank.' },
        { t: 2, name: 'Vylepšený Kick', max: 3, d: 'Kick dočasne znemožní školu kúziel.' },
        { t: 3, name: 'Dual Wield Specialization (R)', max: 5, d: '+1 % dmg off-hand za rank.' },
        { t: 3, name: 'Agitujúci úder', max: 1, d: 'Riposte po úspešnom parry.' },
        { t: 4, name: 'Adrenaline Rush', max: 1, d: 'Dočasne zdvojnásobí regeneráciu energie.' },
        { t: 5, name: 'Blade Flurry', max: 1, d: 'Útoky na krátky čas zasahujú aj druhého nepriateľa.' },
      ] },
      { key: 'sub', name: 'Skrytosť', talents: [
        { t: 0, name: 'Vylepšený Gouge', max: 2, d: 'Dlhší efekt Gouge.' },
        { t: 0, name: 'Zlodejské umenie', max: 5, d: 'Rýchlejšie otváranie zámkov a vreciek.' },
        { t: 1, name: 'Vylepšený Sap', max: 2, d: 'Dlhší efekt Sap.' },
        { t: 1, name: 'Opportunity', max: 5, d: '+ poškodenie zo stealthu za rank.' },
        { t: 2, name: 'Vylepšený Backstab', max: 3, d: '+ poškodenie Backstab.' },
        { t: 2, name: 'Premeditation', max: 1, d: 'Zo stealthu získaš 2 combo body vopred.' },
        { t: 3, name: 'Ohnivé stopy', max: 2, d: '+ pohyblivosť mimo boja.' },
        { t: 3, name: 'Hemorrhage', max: 1, d: 'Zranenie, ktoré krvácaním zvyšuje ďalší prijatý dmg.' },
        { t: 4, name: 'Vylepšený Vanish', max: 2, d: 'Vanish odstráni viac negatívnych efektov.' },
        { t: 5, name: 'Nebezpečné ticho', max: 1, d: 'Dočasná imunita voči kúzlam po Kick/Gouge.' },
      ] },
    ],
  },
  priest: {
    trees: [
      { key: 'disc', name: 'Disciplína', talents: [
        { t: 0, name: 'Zdravý duch', max: 5, d: '+1 % max zdravie za rank.' },
        { t: 0, name: 'Vylepšený Power Word: Fortitude', max: 2, d: 'Silnejšie Fortitude.' },
        { t: 1, name: 'Meditácia', max: 3, d: 'Regenerácia many pokračuje aj pri castovaní.' },
        { t: 1, name: 'Vylepšený Power Word: Shield', max: 3, d: 'Silnejší Power Word: Shield.' },
        { t: 2, name: 'Zbožná vôľa', max: 5, d: '-5 % cena many liečivých kúziel za rank.' },
        { t: 2, name: 'Odolnosť voči magickej škole', max: 5, d: '+1 % odolnosť za rank.' },
        { t: 3, name: 'Vylepšený Mana Burn', max: 2, d: 'Mana Burn má šancu stlmiť cieľ.' },
        { t: 3, name: 'Mäkký odraz', max: 1, d: 'Odrazí ďalší prijatý CC efekt.' },
        { t: 4, name: 'Svätá sústredenosť', max: 5, d: 'Šanca neprerušiť kúzlo pri zásahu.' },
        { t: 5, name: 'Power Infusion', max: 1, d: 'Dočasne +20 % rýchlosť castovania pre cieľ.' },
      ] },
      { key: 'holy', name: 'Svätá', talents: [
        { t: 0, name: 'Zjavenie', max: 5, d: '+1 % liečivá sila za rank.' },
        { t: 0, name: 'Vylepšený Renew', max: 3, d: 'Renew lieči viac.' },
        { t: 1, name: 'Vylepšený Heal', max: 3, d: 'Rýchlejšie zoslanie Heal.' },
        { t: 1, name: 'Zdravý um', max: 5, d: '+ max mana za rank.' },
        { t: 2, name: 'Svätý špecialista', max: 5, d: '+1 % crit šanca liečenia za rank.' },
        { t: 2, name: 'Spirit of Redemption', max: 1, d: 'Po smrti na chvíľu zostaneš ako duch a môžeš liečiť.' },
        { t: 3, name: 'Vylepšený Prayer of Healing', max: 3, d: 'Nižšia cena many Prayer of Healing.' },
        { t: 3, name: 'Svätá sila (P)', max: 5, d: '+1 % crit šanca za rank.' },
        { t: 4, name: 'Lightwell', max: 1, d: 'Postaví studňu svetla, z ktorej sa spoluhráči liečia.' },
        { t: 5, name: 'Guardian Spirit (predchodca)', max: 1, d: 'Ochranný efekt, ktorý zachráni cieľa pred smrťou.' },
      ] },
      { key: 'shadow', name: 'Tieň', talents: [
        { t: 0, name: 'Vylepšený Shadow Word: Pain', max: 2, d: 'Dlhší efekt Shadow Word: Pain.' },
        { t: 0, name: 'Spirit Tap', max: 2, d: 'Po zabití cieľa dočasne vyššia regenerácia many.' },
        { t: 1, name: 'Temná odolnosť', max: 5, d: '+1 % odolnosť voči Shadow škole za rank.' },
        { t: 1, name: 'Zúfalá modlitba', max: 2, d: 'Rýchlejšie castovanie Mind Blast.' },
        { t: 2, name: 'Shadow Focus', max: 5, d: '-cena many shadow kúziel za rank.' },
        { t: 2, name: 'Vylepšený Psychic Scream', max: 2, d: 'Kratší cooldown Psychic Scream.' },
        { t: 3, name: 'Shadow Weaving', max: 5, d: 'Zásahy zvyšujú shadow dmg na cieľ.' },
        { t: 3, name: 'Silence (predchodca)', max: 1, d: 'Umlčí cieľa na krátky čas.' },
        { t: 4, name: 'Vampiric Embrace', max: 1, d: 'Časť shadow dmg lieči aj okolie.' },
        { t: 5, name: 'Mind Flay', max: 1, d: 'Kanálované temné kúzlo s priebežným poškodením.' },
      ] },
    ],
  },
  shaman: {
    trees: [
      { key: 'ele', name: 'Živly', talents: [
        { t: 0, name: 'Convection', max: 5, d: '-cena many Shock a Totem kúziel za rank.' },
        { t: 0, name: 'Vylepšený Lightning Bolt', max: 5, d: 'Rýchlejšie castovanie Lightning Bolt.' },
        { t: 1, name: 'Vylepšený Fire Totems', max: 2, d: 'Silnejšie Fire totemy.' },
        { t: 1, name: 'Totemová odolnosť', max: 5, d: 'Totemy vydržia dlhšie pod útokom.' },
        { t: 2, name: 'Call of Flame', max: 3, d: '+ poškodenie Fire totemov.' },
        { t: 2, name: 'Vylepšený Fire Nova Totem', max: 2, d: 'Kratší cooldown Fire Nova Totem.' },
        { t: 3, name: 'Elemental Focus', max: 1, d: 'Po crit kúzle dočasne lacnejšie ďalšie kúzla.' },
        { t: 3, name: 'Reverberation', max: 5, d: '-cooldown Shock kúziel za rank.' },
        { t: 4, name: 'Elemental Fury', max: 5, d: '+ crit poškodenie elementálnych kúziel za rank.' },
        { t: 5, name: 'Elemental Mastery', max: 1, d: 'Ďalšie kúzlo zoslané okamžite a zaručene kritické.' },
      ] },
      { key: 'enh', name: 'Posilnenie', talents: [
        { t: 0, name: 'Vylepšený Lightning Shield', max: 5, d: 'Silnejší Lightning Shield.' },
        { t: 0, name: 'Prístup k živlom', max: 1, d: 'Odomkne pokročilejšie totemy.' },
        { t: 1, name: 'Vylepšený Ghost Wolf', max: 2, d: 'Rýchlejšie premena na Ghost Wolf.' },
        { t: 1, name: 'Zúrivosť bojovníka', max: 5, d: '+ útočná sila za rank.' },
        { t: 2, name: 'Vylepšený Weapon Totems', max: 3, d: 'Silnejšie zbraňové totemy.' },
        { t: 2, name: 'Stormstrike (predchodca)', max: 1, d: 'Silný melee úder, ktorý zvýši nasledujúci blesk dmg.' },
        { t: 3, name: 'Flurry (Sh)', max: 5, d: 'Po crit zásahu dočasne vyššia rýchlosť útoku.' },
        { t: 3, name: 'Elemental Weapons', max: 3, d: '+ efekt dočasných enchantov na zbrani.' },
        { t: 4, name: 'Windfury Weapon Mastery', max: 1, d: 'Windfury enchant má šancu na extra útoky.' },
        { t: 5, name: 'Dual Wield (Shaman)', max: 1, d: 'Odomkne boj dvoma zbraňami.' },
      ] },
      { key: 'resto', name: 'Obnova', talents: [
        { t: 0, name: 'Vylepšený Healing Wave', max: 5, d: 'Rýchlejšie castovanie Healing Wave.' },
        { t: 0, name: 'Totemová koncentrácia', max: 5, d: 'Šanca neprerušiť zoslanie totemu.' },
        { t: 1, name: 'Vylepšený Reincarnation', max: 2, d: 'Kratší cooldown Reincarnation.' },
        { t: 1, name: 'Totemová vytrvalosť', max: 5, d: '+ polomer pôsobenia totemov za rank.' },
        { t: 2, name: 'Zlepšená regenerácia many', max: 5, d: '+ regenerácia many pri castovaní za rank.' },
        { t: 2, name: 'Vylepšený Water Shield', max: 3, d: 'Silnejší Water Shield.' },
        { t: 3, name: 'Liečivá sústredenosť', max: 3, d: 'Šanca na okamžité ďalšie liečivé kúzlo.' },
        { t: 3, name: 'Nature\'s Swiftness (predchodca)', max: 1, d: 'Ďalšie kúzlo zoslané okamžite.' },
        { t: 4, name: 'Vylepšený Chain Heal', max: 2, d: 'Chain Heal lieči viac cieľov.' },
        { t: 5, name: 'Mana Tide Totem', max: 1, d: 'Totem, ktorý výrazne zrýchli regeneráciu many skupiny.' },
      ] },
    ],
  },
  mage: {
    trees: [
      { key: 'arcane', name: 'Tajomná mágia', talents: [
        { t: 0, name: 'Arcane Subtlety', max: 2, d: '-threat z Arcane kúziel za rank.' },
        { t: 0, name: 'Arcane Focus', max: 5, d: '-cena many Arcane kúziel za rank.' },
        { t: 1, name: 'Vylepšený Arcane Missiles', max: 3, d: 'Šanca neprerušiť Arcane Missiles.' },
        { t: 1, name: 'Arcane Concentration', max: 5, d: 'Šanca na okamžité ďalšie kúzlo po crite.' },
        { t: 2, name: 'Magic Absorption', max: 5, d: '+ odolnosť voči mágii za rank.' },
        { t: 2, name: 'Arcane Meditation', max: 3, d: 'Regenerácia many pokračuje aj pri castovaní.' },
        { t: 3, name: 'Presence of Mind', max: 1, d: 'Ďalšie kúzlo zoslané okamžite.' },
        { t: 3, name: 'Arcane Mind', max: 5, d: '+ max mana za rank.' },
        { t: 4, name: 'Vylepšený Counterspell', max: 2, d: 'Counterspell dlhšie umlčí cieľa.' },
        { t: 5, name: 'Arcane Power', max: 1, d: 'Dočasne výrazne vyššie poškodenie kúziel.' },
      ] },
      { key: 'fire', name: 'Oheň', talents: [
        { t: 0, name: 'Vylepšený Fireball', max: 5, d: 'Rýchlejšie castovanie Fireball.' },
        { t: 0, name: 'Impact (predchodca)', max: 5, d: 'Oheň kúzla majú šancu omráčiť cieľ.' },
        { t: 1, name: 'Ignite', max: 5, d: 'Kritické zásahy pridajú horenie v priebehu času.' },
        { t: 1, name: 'Flame Throwing', max: 2, d: '+ dosah ohnivých kúziel.' },
        { t: 2, name: 'Vylepšený Fire Blast', max: 3, d: 'Kratší cooldown Fire Blast.' },
        { t: 2, name: 'Incineration', max: 2, d: '+ crit poškodenie ohnivých kúziel.' },
        { t: 3, name: 'Pyroblast', max: 1, d: 'Veľmi silné pomaly castované ohnivé kúzlo.' },
        { t: 3, name: 'Zápalný žiar', max: 5, d: '+ crit šanca ohnivých kúziel za rank.' },
        { t: 4, name: 'Majstrovstvo ohňa', max: 5, d: '+ poškodenie ohnivých kúziel za rank.' },
        { t: 5, name: 'Combustion', max: 1, d: 'Najbližšie kúzla majú zaručene vyššiu crit šancu.' },
      ] },
      { key: 'frost', name: 'Mráz', talents: [
        { t: 0, name: 'Vylepšený Frostbolt', max: 5, d: 'Rýchlejšie castovanie Frostbolt.' },
        { t: 0, name: 'Elemental Precision', max: 3, d: '+ šanca na zásah mrazivými/ohnivými kúzlami.' },
        { t: 1, name: 'Ice Shards', max: 5, d: '+ crit poškodenie mrazivých kúziel za rank.' },
        { t: 1, name: 'Frostbite', max: 3, d: 'Mrazivé kúzla majú šancu zmraziť cieľ.' },
        { t: 2, name: 'Vylepšený Frost Nova', max: 2, d: 'Kratší cooldown Frost Nova.' },
        { t: 2, name: 'Permafrost', max: 3, d: 'Zmrazení nepriatelia sú spomalení dlhšie.' },
        { t: 3, name: 'Ice Barrier', max: 1, d: 'Štít, ktorý pohlcuje poškodenie.' },
        { t: 3, name: 'Vylepšený Blizzard', max: 3, d: 'Blizzard má šancu omráčiť cieľ.' },
        { t: 4, name: 'Vlastník chladu', max: 5, d: '+ odolnosť voči spomaleniu za rank.' },
        { t: 5, name: 'Winter\'s Chill', max: 1, d: 'Mrazivé kúzla znížia odolnosť cieľa voči mrazu.' },
      ] },
    ],
  },
  warlock: {
    trees: [
      { key: 'affl', name: 'Trápenie', talents: [
        { t: 0, name: 'Vylepšený Corruption', max: 5, d: 'Rýchlejšie zoslanie Corruption.' },
        { t: 0, name: 'Suppression', max: 2, d: '+ šanca na zásah s Affliction kúzlami.' },
        { t: 1, name: 'Improved Curse of Weakness', max: 2, d: 'Silnejší Curse of Weakness.' },
        { t: 1, name: 'Vylepšený Drain Soul', max: 2, d: '+ poškodenie Drain Soul.' },
        { t: 2, name: 'Vylepšený Life Tap', max: 2, d: 'Life Tap dáva viac many.' },
        { t: 2, name: 'Zúfalstvo', max: 5, d: '+ celkové poškodenie DoT kúziel za rank.' },
        { t: 3, name: 'Nightfall', max: 2, d: 'Corruption má šancu umožniť okamžité kúzlo zadarmo.' },
        { t: 3, name: 'Empowered Corruption', max: 3, d: 'Corruption profituje viac zo spell damage.' },
        { t: 4, name: 'Shadow Mastery', max: 5, d: '+ poškodenie Shadow kúziel za rank.' },
        { t: 5, name: 'Dark Pact', max: 1, d: 'Vysaje manu z vlastného démona.' },
      ] },
      { key: 'demo', name: 'Démonológia', talents: [
        { t: 0, name: 'Improved Healthstone', max: 2, d: 'Healthstone lieči viac.' },
        { t: 0, name: 'Improved Imp', max: 3, d: 'Silnejší Imp (ohnivý útok, odolnosť).' },
        { t: 1, name: 'Démonická embrace', max: 5, d: '+ max zdravie, -max mana za rank.' },
        { t: 1, name: 'Improved Voidwalker', max: 3, d: 'Voidwalker má viac zdravia a lepší threat.' },
        { t: 2, name: 'Fel Intellect', max: 3, d: '+ max mana démona a jeho vlastníka.' },
        { t: 2, name: 'Improved Succubus', max: 3, d: 'Silnejší Seduction efekt.' },
        { t: 3, name: 'Fel Domination', max: 1, d: 'Okamžité privolanie démona.' },
        { t: 3, name: 'Demonic Sacrifice', max: 1, d: 'Obetuj démona za dočasný bonus.' },
        { t: 4, name: 'Master Summoner', max: 2, d: 'Rýchlejšie privolávanie démonov.' },
        { t: 5, name: 'Summon Felhunter+', max: 1, d: 'Odomkne a vylepší Felhuntera, ktorý tlmí kúzla.' },
      ] },
      { key: 'destro', name: 'Skaza', talents: [
        { t: 0, name: 'Improved Shadow Bolt', max: 5, d: 'Zásahy Shadow Bolt zvýšia ďalšie poškodenie na cieľ.' },
        { t: 0, name: 'Cataclysm', max: 5, d: '-cena many Destruction kúziel za rank.' },
        { t: 1, name: 'Bane', max: 5, d: 'Rýchlejšie castovanie Destruction kúziel.' },
        { t: 1, name: 'Improved Firebolt', max: 2, d: 'Silnejší Firebolt démona.' },
        { t: 2, name: 'Devastation', max: 5, d: '+ crit šanca Destruction kúziel za rank.' },
        { t: 2, name: 'Shadowburn', max: 1, d: 'Okamžité kúzlo, ktoré pri zabití cieľa vráti manu.' },
        { t: 3, name: 'Intensity', max: 3, d: 'Šanca neprerušiť kúzlo pri zásahu.' },
        { t: 3, name: 'Destructive Reach', max: 2, d: '+ dosah Destruction kúziel.' },
        { t: 4, name: 'Pyroclasm', max: 2, d: 'Po omráčení cieľa vyššia crit šanca.' },
        { t: 5, name: 'Ruin', max: 1, d: '+100 % crit poškodenie Destruction kúziel.' },
      ] },
    ],
  },
  druid: {
    trees: [
      { key: 'balance', name: 'Rovnováha', talents: [
        { t: 0, name: 'Improved Wrath', max: 3, d: 'Rýchlejšie castovanie Wrath.' },
        { t: 0, name: 'Vylepšený Moonfire', max: 2, d: 'Nižšia cena many Moonfire.' },
        { t: 1, name: 'Vylepšený Thorns', max: 2, d: 'Thorns pôsobí dlhšie.' },
        { t: 1, name: 'Starlight Wrath', max: 5, d: 'Rýchlejšie castovanie Moonfire/Starfire/Wrath.' },
        { t: 2, name: 'Nature\'s Grace', max: 1, d: 'Po crite dočasne rýchlejšie castovanie.' },
        { t: 2, name: 'Vylepšený Moonkin Form (predchodca)', max: 2, d: 'Pripravuje na budúcu formu moonkina.' },
        { t: 3, name: 'Moonfury', max: 5, d: '+ poškodenie Arcane/Nature kúziel za rank.' },
        { t: 3, name: 'Moonglow', max: 3, d: '-cena many hlavných kúziel za rank.' },
        { t: 4, name: 'Insect Swarm', max: 1, d: 'Priebežné poškodenie, ktoré znižuje šancu na zásah cieľa.' },
        { t: 5, name: 'Force of Nature', max: 1, d: 'Privolá strom-elementálov, ktorí bojujú za teba.' },
      ] },
      { key: 'feral', name: 'Divoká forma', talents: [
        { t: 0, name: 'Ferocity', max: 5, d: '-cena zúrivosti/energie schopností za rank.' },
        { t: 0, name: 'Vylepšený Mark of the Wild', max: 2, d: 'Silnejší Mark of the Wild.' },
        { t: 1, name: 'Feral Aggression', max: 5, d: '+ poškodenie Maul a Swipe za rank.' },
        { t: 1, name: 'Thick Hide (D)', max: 3, d: '+ brnenie v medveďovi za rank.' },
        { t: 2, name: 'Feline Swiftness', max: 2, d: '+ rýchlosť pohybu v mačacej forme.' },
        { t: 2, name: 'Vylepšený Claw', max: 3, d: '+ poškodenie Claw.' },
        { t: 3, name: 'Sharpened Claws', max: 3, d: '+ crit šanca v mačacej/medvedej forme za rank.' },
        { t: 3, name: 'Feral Charge', max: 1, d: 'Skok k cieľu, ktorý ho omráči (v medveďovi/mačke).' },
        { t: 4, name: 'Enrage (predchodca)', max: 1, d: 'Dočasne vyššie poškodenie v medveďovi.' },
        { t: 5, name: 'Berserk (predchodca)', max: 1, d: 'Dočasné zrušenie GCD na schopnosti s cooldownom.' },
      ] },
      { key: 'resto', name: 'Obnova', talents: [
        { t: 0, name: 'Improved Mark of the Wild+', max: 2, d: 'Ešte silnejšie Mark of the Wild.' },
        { t: 0, name: 'Nature\'s Grasp', max: 1, d: 'Prírodné korene zadržia útočníka.' },
        { t: 1, name: 'Vylepšený Nature\'s Grasp', max: 4, d: 'Vyššia šanca zasiahnuť Nature\'s Grasp.' },
        { t: 1, name: 'Vylepšený Healing Touch', max: 5, d: 'Rýchlejšie castovanie Healing Touch.' },
        { t: 2, name: 'Tranquil Spirit', max: 5, d: '-cena many liečivých kúziel za rank.' },
        { t: 2, name: 'Vylepšený Rejuvenation', max: 4, d: 'Rejuvenation lieči viac.' },
        { t: 3, name: 'Nature\'s Swiftness', max: 1, d: 'Ďalšie prírodné kúzlo zoslané okamžite.' },
        { t: 3, name: 'Gift of Nature', max: 5, d: '+ liečivá sila všetkých kúziel za rank.' },
        { t: 4, name: 'Swiftmend', max: 1, d: 'Okamžite vylieči cieľa spotrebovaním HoT efektu.' },
        { t: 5, name: 'Tranquility', max: 1, d: 'Mocné kanálované liečenie celej skupiny.' },
      ] },
    ],
  },
};

// Zoberie strom po strome (podľa poradia) a pridelí body zhora nadol, kým sa nevyčerpá
// rozpočet (max 51 na leveli 60) — slúži na vygenerovanie odporúčaných buildov a odkazu do kalkulačky.
export function greedyAllocate(classSlug, order, budget = 51) {
  const trees = TALENT_TREES[classSlug].trees;
  const ranks = trees.map((t) => t.talents.map(() => 0));
  const spent = trees.map(() => 0);
  let remaining = budget;
  for (const ti of order) {
    const tree = trees[ti];
    for (let tier = 0; tier <= 5; tier++) {
      if (spent[ti] < tier * 5) break;
      tree.talents.forEach((tal, idx) => {
        if (tal.t !== tier || remaining <= 0) return;
        const add = Math.min(tal.max, remaining);
        ranks[ti][idx] = add;
        spent[ti] += add;
        remaining -= add;
      });
    }
  }
  const hash = ranks.map((r) => r.join('')).join('-');
  const picks = trees.map((tree, ti) => tree.talents
    .map((tal, idx) => ({ name: tal.name, rank: ranks[ti][idx], max: tal.max }))
    .filter((p) => p.rank > 0));
  return { hash, picks, spent, totalSpent: budget - remaining };
}

// Orientačné buildy inšpirované komunitnými leveling/raid špecializáciami (Wowhead Classic, Icy Veins a i.),
// prepočítané na body v našej kalkulačke — presné čísla sa od zdrojov líšia, keďže naše stromy sú vlastné zhrnutie.
export const BUILD_PLAN = [
  { slug: 'warrior', level: { order: [1, 0, 2], label: 'Fury', note: 'Dual-wield so sústavným poškodením uľahčuje sólo levelovanie a farmenie.' }, raid: { order: [2, 0, 1], label: 'Protection', note: 'Najžiadanejšia rola warriora v raide — tank s vysokým brnením a threatom.' } },
  { slug: 'paladin', level: { order: [2, 0, 1], label: 'Retribution', note: 'Seal of Command a melee sila zrýchlia levelovanie aj sólo questing.' }, raid: { order: [0, 2, 1], label: 'Holy', note: 'Primárna raidová rola paladina — masové a spoľahlivé liečenie.' } },
  { slug: 'hunter', level: { order: [0, 2, 1], label: 'Beast Mastery', note: 'Silný a odolný pet výrazne znižuje riziko pri sólo levelovaní.' }, raid: { order: [1, 0, 2], label: 'Marksmanship', note: 'Najvyšší stabilný ranged damage na dlhé raidové fighty.' } },
  { slug: 'rogue', level: { order: [1, 0, 2], label: 'Combat', note: 'Vyššia výdrž a damage v dlhších súbojoch počas levelovania.' }, raid: { order: [0, 1, 2], label: 'Assassination', note: 'Jedy a combo body dávajú v raide stabilný a vysoký damage.' } },
  { slug: 'priest', level: { order: [2, 0, 1], label: 'Shadow', note: 'Vlastný damage a drain many uľahčia bezpečné sólo hranie.' }, raid: { order: [1, 0, 2], label: 'Holy', note: 'Primárna raidová rola priesta — hlavný liečiteľ skupiny.' } },
  { slug: 'shaman', level: { order: [1, 0, 2], label: 'Enhancement', note: 'Melee sila a Windfury pomáhajú rýchlejšie zabíjať pri levelovaní.' }, raid: { order: [2, 0, 1], label: 'Restoration', note: 'Chain Heal a totemy z neho robia kľúčového raidového healera.' } },
  { slug: 'mage', level: { order: [1, 2, 0], label: 'Fire', note: 'Vysoký burst a AoE farmenie celých packov zrýchli levelovanie.' }, raid: { order: [1, 0, 2], label: 'Fire', note: 'Štandardná raidová špecializácia mága vo vanille.' } },
  { slug: 'warlock', level: { order: [0, 1, 2], label: 'Affliction', note: 'DoT kúzla a Drain Life umožňujú bezpečné a pohodlné sólo levelovanie.' }, raid: { order: [2, 0, 1], label: 'Destruction', note: 'Shadowburn a Ruin dávajú v raide silný burst damage.' } },
  { slug: 'druid', level: { order: [1, 2, 0], label: 'Feral', note: 'Medveď na tankovanie, mačka na damage — flexibilita pri sólo hraní.' }, raid: { order: [2, 0, 1], label: 'Restoration', note: 'Primárna raidová rola druida — HoT liečenie celej skupiny.' } },
];
