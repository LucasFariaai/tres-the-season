export type WineCategory = 'sparkling' | 'white' | 'red' | 'dessert'

export interface Wine {
  id: string
  category: WineCategory
  country: string
  region: string
  subregion?: string
  vintage?: string
  name: string
  producer: string
  grapes: string
  price: number
  featured?: boolean
}

// Source of truth: WINE STOCK LUCAS.xlsx (live stock)
export const wines: Wine[] = [
  // ── SPARKLING ──
  // France · Cuvée de Prestige Champagne
  { id: 's01', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', name: 'Grande Cuvée 167ème Édition', producer: 'Krug', grapes: 'Chardonnay, Pinot Noir, Pinot Meunier', price: 680, featured: true },
  { id: 's02', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', vintage: '2006', name: 'Vintage', producer: 'Krug', grapes: 'Chardonnay, Pinot Noir, Pinot Meunier', price: 840, featured: true },
  { id: 's03', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', vintage: '1990', name: 'R.D.', producer: 'Bollinger', grapes: '', price: 895 },
  { id: 's04', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', vintage: '2015', name: 'Dom Pérignon', producer: 'Dom Pérignon', grapes: 'Pinot Noir, Chardonnay', price: 560, featured: true },
  { id: 's05', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', vintage: '2012', name: 'Dom Pérignon Magnum', producer: 'Dom Pérignon', grapes: 'Pinot Noir, Chardonnay', price: 950 },
  // France · Cuvée de Prestige Champagne · Ludes
  { id: 's06', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Ludes', name: 'Brut Réserve', producer: 'Bérèche & Fils', grapes: 'Chardonnay, Pinot Meunier, Pinot Noir', price: 155 },
  { id: 's07', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Ludes', vintage: '2016', name: 'Le Cran', producer: 'Bérèche & Fils', grapes: 'Chardonnay, Pinot Noir', price: 275 },
  // France · Cuvée de Prestige Champagne · Côte de Bar
  { id: 's08', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Côte de Bar', vintage: '2020', name: 'Côte De Val Vilaine, Blanc de Noirs', producer: 'Roses de Jeanne', grapes: 'Pinot Noir', price: 325 },
  { id: 's09', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Côte de Bar', vintage: '2016', name: 'La Haute Lemblè, Blanc de Blanc', producer: 'Roses de Jeanne', grapes: 'Chardonnay', price: 315 },
  // France · Cuvée de Prestige Champagne · Aube
  { id: 's10', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Aube', vintage: '2015', name: 'Les Cogneaux', producer: 'Bénédicte Ruppert-Leroy', grapes: 'Pinot Noir', price: 155 },
  // France · Cuvée de Prestige Champagne · Côte de Blancs
  { id: 's11', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Côte de Blancs', vintage: '2016', name: 'Chromatique', producer: 'Stephane Regnault', grapes: 'Chardonnay', price: 220 },
  { id: 's12', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Côte de Blancs', name: 'Grand Cru Lydien 99', producer: 'Stephane Regnault', grapes: 'Chardonnay', price: 225 },
  // France · Cuvée de Prestige Champagne · Coteaux du Morin
  { id: 's13', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Coteaux du Morin', vintage: '2019', name: 'Les Maillons 48M, Blanc de Noirs', producer: 'Ulysse Collin', grapes: 'Pinot Noir', price: 495 },
  // France · Cuvée de Prestige Champagne · Vallée de Marne
  { id: 's14', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Vallée de Marne', name: 'La Parcelle', producer: 'Chevreux Bournazel', grapes: 'Pinot Meunier, Chardonnay', price: 295 },
  { id: 's15', category: 'sparkling', country: 'France', region: 'Cuvée de Prestige Champagne', subregion: 'Vallée de Marne', name: 'Blanc de noir', producer: 'Blanc de noir', grapes: 'Cremant de Jura', price: 130 },
  // ── WHITE ──
  // Germany · 
  { id: 'w01', category: 'white', country: 'Germany', region: '', vintage: '2018', name: 'Riesling, Sterntaucher', producer: 'Jakob Tennstedt', grapes: 'Riesling', price: 135 },
  { id: 'w02', category: 'white', country: 'Germany', region: '', vintage: '2016', name: 'Riesling GG Felsenberg', producer: 'Schäfer-Fröhlich', grapes: 'Riesling', price: 235 },
  { id: 'w03', category: 'white', country: 'Germany', region: '', vintage: '2019', name: 'Riesling Trocken Gaisböhl', producer: 'Dr. Bürklin-Wolf', grapes: 'Riesling', price: 165 },
  { id: 'w04', category: 'white', country: 'Germany', region: '', vintage: '2019', name: 'Riesling Trocken Unikat, Landgeflecht', producer: 'Peter Jakob Kühn', grapes: 'Riesling', price: 265 },
  // Germany · Rheinhessen
  { id: 'w05', category: 'white', country: 'Germany', region: 'Rheinhessen', vintage: '2021', name: 'Riesling GG ‘Aulerde’', producer: 'Wittmann', grapes: 'Riesling', price: 195 },
  { id: 'w06', category: 'white', country: 'Germany', region: 'Rheinhessen', vintage: '2020', name: 'Riesling GG ‘Aulerde’', producer: 'Wittmann', grapes: 'Riesling', price: 180 },
  // Austria · Wachau
  { id: 'w07', category: 'white', country: 'Austria', region: 'Wachau', vintage: '2024', name: 'Grüner Veltliner, Ried Loibenberg Loibner', producer: 'Emrich Knoll', grapes: 'Grüner Veltliner', price: 170 },
  { id: 'w08', category: 'white', country: 'Austria', region: 'Wachau', vintage: '2023', name: 'Riesling, Singerriedel', producer: 'Frantz Hirtzberger', grapes: 'Riesling', price: 320 },
  { id: 'w09', category: 'white', country: 'Austria', region: 'Wachau', vintage: '2023', name: 'Grüner Veltliner, Honivogl', producer: 'Frantz Hirtzberger', grapes: 'Grüner Veltliner', price: 315 },
  // Austria · Wachau · Burgenland
  { id: 'w10', category: 'white', country: 'Austria', region: 'Wachau', subregion: 'Burgenland', vintage: '2017', name: 'Grüner Veltliner, Non-Tradition', producer: 'Christian Tschida', grapes: 'Grüner Veltliner', price: 150 },
  // Austria · Wachau · Kamptal
  { id: 'w11', category: 'white', country: 'Austria', region: 'Wachau', subregion: 'Kamptal', vintage: '2016', name: 'Riesling, Ried Gaisberg Zöbing', producer: 'Weingut Hirsch', grapes: 'Riesling', price: 140 },
  // France · Burgundy - Grand Cru
  { id: 'w12', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', vintage: '2022', name: 'Hospices de Beaune, Cuvée Paul Chanson', producer: 'Jean-Claude Ramonet', grapes: 'Chardonnay', price: 825, featured: true },
  { id: 'w13', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', vintage: '2022', name: 'Hospices de Beaune, 1er Cru Cuvée Johan Humblot', producer: 'Jean-Claude Ramonet', grapes: 'Chardonnay', price: 650 },
  { id: 'w14', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', vintage: '2022', name: 'Corton Charlemagne', producer: 'Pierre Yves Colin Morey', grapes: 'Chardonnay', price: 665 },
  { id: 'w15', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', vintage: '2019', name: 'Hospices de Beaune, Cuvée Docteur Peste', producer: 'Pierre Yves Colin Morey', grapes: 'Chardonnay', price: 675 },
  { id: 'w16', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', vintage: '2018', name: 'Chevalier-Montrachet Grand Cru', producer: 'Domaine Jean-Marc Pillot', grapes: 'Chardonnay', price: 695 },
  // France · Burgundy - Grand Cru · Chablis
  { id: 'w17', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chablis', vintage: '2018', name: 'Grand Cru Vaudésir', producer: 'Domaine Long-Depaquit', grapes: 'Chardonnay', price: 170 },
  { id: 'w18', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chablis', vintage: '2018', name: '1er Cru Butteaux', producer: 'Pattes Loup (Thomas Pico)', grapes: 'Chardonnay', price: 195 },
  { id: 'w19', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chablis', vintage: '2018', name: '1er Cru Beauregard', producer: 'Pattes Loup (Thomas Pico)', grapes: 'Chardonnay', price: 205 },
  { id: 'w20', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chablis', vintage: '2019', name: 'Chablis', producer: 'Vincent Dauvissat', grapes: 'Chardonnay', price: 225 },
  { id: 'w21', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chablis', vintage: '2018', name: '1er Cru La Forest', producer: 'Vincent Dauvissat', grapes: 'Chardonnay', price: 375 },
  { id: 'w22', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chablis', vintage: '2017', name: '1er Cru Vaillons', producer: 'Vincent Dauvissat', grapes: 'Chardonnay', price: 475 },
  // France · Burgundy - Grand Cru · Meursault
  { id: 'w23', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Meursault', vintage: '2022', name: 'Saint Christophe', producer: 'Domaine de Montille', grapes: 'Chardonnay', price: 185 },
  { id: 'w24', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Meursault', vintage: '2021', name: 'Criots', producer: 'Ballot-Millot', grapes: 'Chardonnay', price: 195 },
  { id: 'w25', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Meursault', vintage: '2020', name: 'Les Terres Blanches', producer: 'Pierre Morey', grapes: 'Chardonnay', price: 210 },
  { id: 'w26', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Meursault', vintage: '2020', name: '1er Cru Charmes', producer: 'Phillipe Bouzereau', grapes: 'Chardonnay', price: 225 },
  { id: 'w27', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Meursault', vintage: '2020', name: '1er Cru Charmes', producer: 'Yves Boyer-Martenot', grapes: 'Chardonnay', price: 245 },
  { id: 'w28', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Meursault', vintage: '2020', name: '1er Cru ‘Charmes’', producer: 'Pierre-Yves Colin-Morey', grapes: 'Chardonnay', price: 650 },
  { id: 'w29', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Meursault', vintage: '2023', name: '1er Cru Blagny Blanc', producer: 'G & C Boillot', grapes: 'Chardonnay', price: 355 },
  { id: 'w30', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Meursault', vintage: '2022', name: '1er Cru Blagny Blanc', producer: 'G & C Boillot', grapes: 'Chardonnay', price: 365 },
  { id: 'w31', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Meursault', vintage: '2022', name: 'Les Clous', producer: 'G & C Boillot', grapes: 'Chardonnay', price: 220 },
  // France · Burgundy - Grand Cru · Puligny-Montrachet
  { id: 'w32', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2020', name: 'Les Reuchaux', producer: 'Yves Boyer-Martenot', grapes: 'Chardonnay', price: 185 },
  { id: 'w33', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2022', name: 'Les Enseignères', producer: 'Jean-Claude Ramonet', grapes: 'Chardonnay', price: 375 },
  { id: 'w34', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2023', name: '1er Cru Les Caillerets', producer: 'G & C Boillot', grapes: 'Chardonnay', price: 360 },
  { id: 'w35', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2022', name: 'Les Enseignères', producer: 'G & C Boillot', grapes: 'Chardonnay', price: 275 },
  { id: 'w36', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2022', name: '1er Cru Les Caillerets', producer: 'G & C Boillot', grapes: 'Chardonnay', price: 355 },
  { id: 'w37', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2021', name: '1er Cru La Garenne', producer: 'Joseph Colin', grapes: 'Chardonnay', price: 285 },
  { id: 'w38', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2022', name: '1er Cru La Garenne', producer: 'Domaine de Montille', grapes: 'Chardonnay', price: 305 },
  { id: 'w39', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2019', name: '1er Cru le Cailleret', producer: 'Domaine de Montille', grapes: 'Chardonnay', price: 325 },
  { id: 'w40', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2021', name: '1er Cru Clos de la Mouchère', producer: 'Henri Boillot', grapes: 'Chardonnay', price: 305 },
  { id: 'w41', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2020', name: '1er Cru Clos de la Mouchère', producer: 'Henri Boillot', grapes: 'Chardonnay', price: 370 },
  { id: 'w42', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Puligny-Montrachet', vintage: '2021', name: 'Puligny Montrachet', producer: 'Henri Boillot', grapes: 'Chardonnay', price: 205 },
  // France · Burgundy - Grand Cru · Chassagne-Montrachet
  { id: 'w43', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2020', name: '1er Cru Vigne Blanche', producer: 'Pierre Gerardin', grapes: 'Chardonnay', price: 265 },
  { id: 'w44', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2019', name: '1er Cru Boudriotte', producer: 'Jean-Claude Ramonet', grapes: 'Chardonnay', price: 445 },
  { id: 'w45', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2023', name: 'Vielles Vignes', producer: 'Pierre Yves Colin-Morey', grapes: 'Chardonnay', price: 345 },
  { id: 'w46', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2020', name: '1er Cru Abbaye de Morgeot', producer: 'Pierre Yves Colin-Morey', grapes: 'Chardonnay', price: 485 },
  { id: 'w47', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2018', name: '1er Cru Abbaye de Morgeot', producer: 'Pierre Yves Colin-Morey', grapes: 'Chardonnay', price: 495 },
  { id: 'w48', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2021', name: '1er Cru Vergers Clos Saint Marc', producer: 'Jean-Marc Pillot', grapes: 'Chardonnay', price: 345 },
  { id: 'w49', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2021', name: '1er cru Morgeot Les Fairendes', producer: 'Jean-Marc Pillot', grapes: 'Chardonnay', price: 345 },
  { id: 'w50', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2021', name: '1er Cru Caillerets', producer: 'Jean-Marc Pillot', grapes: 'Chardonnay', price: 235 },
  { id: 'w51', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2020', name: '1er Cru Les Champs Gain', producer: 'Jean-Marc Pillot', grapes: 'Chardonnay', price: 325 },
  // France · Burgundy - Grand Cru · Côte de Beaune
  { id: 'w52', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Côte de Beaune', vintage: '2023', name: 'Bourgogne Chardonnay', producer: 'Thierry Pillot', grapes: 'Chardonnay', price: 145 },
  // France · Burgundy - Grand Cru · Saint Aubin
  { id: 'w53', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2023', name: 'Le Ban', producer: 'Thierry Pillot', grapes: 'Chardonnay', price: 255 },
  { id: 'w54', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2023', name: '1e cru Les Pitangerets', producer: 'Paul Pillot', grapes: 'Chardonnay', price: 295 },
  { id: 'w55', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2022', name: '1er Cru Sous Roche Dumay', producer: 'Françoise & Denis Clair', grapes: 'Chardonnay', price: 175 },
  { id: 'w56', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2021', name: '1er Cru Les Frionnes', producer: 'Joseph Colin', grapes: 'Chardonnay', price: 175 },
  { id: 'w57', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2020', name: '1er Cru Les Charmots', producer: 'Arnaud Baillot', grapes: 'Chardonnay', price: 170 },
  { id: 'w58', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2019', name: '1er Cru Les Murgers des Dents de Chien', producer: 'Jean-Claude Ramonet', grapes: 'Chardonnay', price: 335 },
  { id: 'w59', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2022', name: 'Rosé de Pinot Noir (rosé)', producer: 'Pierre Yves Colin-Morey', grapes: 'Pinot noir', price: 165 },
  { id: 'w60', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2023', name: '1er Cru ‘Hommage À Marguerite’', producer: 'Pierre-Yves Colin-Morey', grapes: 'Chardonnay', price: 325 },
  { id: 'w61', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2022', name: '1er Cru ‘Hommage À Marguerite’', producer: 'Pierre-Yves Colin-Morey', grapes: 'Chardonnay', price: 365 },
  { id: 'w62', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Saint Aubin', vintage: '2021', name: '1er Cru ‘Hommage À Marguerite’', producer: 'Pierre-Yves Colin-Morey', grapes: 'Chardonnay', price: 305 },
  // France · Burgundy - Grand Cru · Hautes-Côtes-de-Beaune
  { id: 'w63', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Hautes-Côtes-de-Beaune', vintage: '2023', name: 'Vincent Dancer', producer: 'Vincent Dancer', grapes: 'Chardonnay', price: 155 },
  { id: 'w64', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Hautes-Côtes-de-Beaune', vintage: '2023', name: 'Au Bout Du Monde', producer: 'Pierre Yves Colin-Morey', grapes: 'Chardonnay', price: 175 },
  { id: 'w65', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Hautes-Côtes-de-Beaune', vintage: '2021', name: 'Au Bout Du Monde', producer: 'Pierre Yves Colin-Morey', grapes: 'Chardonnay', price: 215 },
  { id: 'w66', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Hautes-Côtes-de-Beaune', vintage: '2016', name: 'Vigne de a Cote', producer: 'Jules Desjourney', grapes: 'Chardonnay', price: 215 },
  // France · Burgundy - Grand Cru · Sancerre
  { id: 'w67', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Sancerre', vintage: '2022', name: 'Monts Damnés', producer: 'Gérard Boulay', grapes: 'Sauvignon Blanc', price: 155 },
  // France · Burgundy - Grand Cru · Pouilly-Fumé
  { id: 'w68', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Pouilly-Fumé', vintage: '2022', name: 'Silex', producer: 'Domaine Didier Dagueneau', grapes: 'Sauvignon Blanc', price: 395 },
  { id: 'w69', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Pouilly-Fumé', vintage: '2022', name: 'Clos de la Coulée de Serrant', producer: 'Nicolas Joly', grapes: 'Chenin Blanc', price: 295 },
  { id: 'w70', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Pouilly-Fumé', vintage: '2020', name: 'Clos de la Coulée de Serrant', producer: 'Nicolas Joly', grapes: 'Chenin Blanc', price: 300 },
  { id: 'w71', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Pouilly-Fumé', vintage: '2020', name: 'Les Nourrissons', producer: 'Stéphane Bernaudeau', grapes: 'Chenin (Vigne Centenaire)', price: 385 },
  // France · Burgundy - Grand Cru · Jura
  { id: 'w72', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Jura', vintage: '2018', name: 'Arbois', producer: 'Tissot', grapes: 'Savagnin', price: 175 },
  { id: 'w73', category: 'white', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Jura', vintage: '2018', name: 'Le Clos, La Tour de Curon', producer: 'Tissot', grapes: 'Chardonnay', price: 295 },
  // Spain · 
  { id: 'w74', category: 'white', country: 'Spain', region: '', vintage: '2023', name: 'Kalamity', producer: 'Oxer', grapes: 'Viura, Calagrano', price: 280 },
  // Spain · Dessert Wine
  { id: 'w75', category: 'white', country: 'Spain', region: 'Dessert Wine', vintage: '2016', name: 'Chateau d’Yquem', producer: '(demi bouteilles)', grapes: 'Sémillon, Sauvignon Blanc', price: 440 },
  { id: 'w76', category: 'white', country: 'Spain', region: 'Dessert Wine', vintage: '2010', name: 'Chateau d’Yquem', producer: '(demi bouteilles)', grapes: 'Sémillon, Sauvignon Blanc', price: 485 },
  // ── RED ──
  // Germany · 
  { id: 'r01', category: 'red', country: 'Germany', region: '', vintage: '2019', name: 'GG Walporzheimer Kräuterberg', producer: 'Weingut JJ Adeneuer', grapes: 'Spätburgunder', price: 175 },
  // Austria · Burgenland
  { id: 'r02', category: 'red', country: 'Austria', region: 'Burgenland', vintage: '2018', name: 'Felsen II', producer: 'Christian Tschida', grapes: 'Syrah', price: 135 },
  { id: 'r03', category: 'red', country: 'Austria', region: 'Burgenland', vintage: '2017', name: 'Himmel auf Erden rot', producer: 'Christian Tschida', grapes: 'Cabernet Franc & Zweigelt', price: 90 },
  { id: 'r04', category: 'red', country: 'Austria', region: 'Burgenland', vintage: '2015', name: 'Felsen I', producer: 'Christian Tschida', grapes: 'Syrah', price: 140 },
  // France · Burgundy - Grand Cru
  { id: 'r05', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', vintage: '2017', name: 'Domaine Forey Père & Fils', producer: 'Domaine Forey Père & Fils', grapes: 'Pinot Noir', price: 305 },
  { id: 'r06', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', vintage: '2013', name: 'Clos du Roi', producer: 'Domaine de Montille', grapes: 'Pinot Noir', price: 325 },
  // France · Burgundy - Grand Cru · Vosne-Romanée
  { id: 'r07', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Vosne-Romanée', vintage: '2013', name: '1er Cru Les Suchots', producer: 'Domaine de Bellene', grapes: 'Pinot Noir', price: 285 },
  { id: 'r08', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Vosne-Romanée', vintage: '2012', name: '1er Cru Les Suchots', producer: 'Domaine de Bellene', grapes: 'Pinot Noir', price: 295 },
  // France · Burgundy - Grand Cru · Pommard
  { id: 'r09', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Pommard', vintage: '2020', name: 'Pommard 1er Cru Les Grands Epenots', producer: 'Pierre Morey', grapes: 'Pinot Noir', price: 255 },
  { id: 'r10', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Pommard', vintage: '2020', name: 'Pommard 1er cru les Rugiens', producer: 'Pierre Girardin', grapes: 'Pinot Noir', price: 245 },
  { id: 'r11', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Pommard', vintage: '2015', name: 'Pommard 1er cru Rugiens', producer: 'Du Pavillon (Albert Bichot)', grapes: 'Pinot Noir', price: 235 },
  { id: 'r12', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Pommard', vintage: '2016', name: 'Pommard 1er Cru Pezerolles', producer: 'Domaine de Montille', grapes: 'Pinot Noir', price: 245 },
  { id: 'r13', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Pommard', vintage: '2013', name: 'Pommard 1er Cru Pezerolles', producer: 'Domaine de Montille', grapes: 'Pinot Noir', price: 230 },
  // France · Burgundy - Grand Cru · Chassagne-Montrachet
  { id: 'r14', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Chassagne-Montrachet', vintage: '2023', name: '1er Cru Clos Saint- Jean', producer: 'Pierre Yves Colin-Morey', grapes: 'Pinot Noir', price: 325 },
  // France · Burgundy - Grand Cru · Volnay
  { id: 'r15', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Volnay', vintage: '2021', name: 'Volnay', producer: 'Domaine Henri Boillot', grapes: 'Pinot Noir', price: 165 },
  { id: 'r16', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Volnay', vintage: '2018', name: '1er Cru Les Fremiets', producer: 'Domaine Henri Boillot', grapes: 'Pinot Noir', price: 245 },
  { id: 'r17', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Volnay', vintage: '2018', name: '1er Cru En Cailleret', producer: 'Domaine Henri Boillot', grapes: 'Pinot Noir', price: 305 },
  { id: 'r18', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Volnay', vintage: '2017', name: '1er Cru Champans', producer: 'Domaine de Montille', grapes: 'Pinot Noir', price: 260 },
  { id: 'r19', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Volnay', vintage: '2016', name: '1er Cru Champans', producer: 'Domaine de Montille', grapes: 'Pinot Noir', price: 275 },
  { id: 'r20', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Volnay', vintage: '2023', name: '1er Cru La Riotte', producer: 'Pierre Yves Colin-Morey', grapes: 'Pinot Noir', price: 285 },
  // France · Burgundy - Grand Cru · Bourgogne Rouge
  { id: 'r21', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Bourgogne Rouge', vintage: '2021', name: 'Henri Boillot', producer: 'Henri Boillot', grapes: 'Pinot Noir', price: 145 },
  { id: 'r22', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Bourgogne Rouge', vintage: '2023', name: 'Paul Pillot', producer: 'Paul Pillot', grapes: 'Pinot Noir', price: 145 },
  { id: 'r23', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Bourgogne Rouge', vintage: '2021', name: 'Paul Pillot', producer: 'Paul Pillot', grapes: 'Pinot Noir', price: 155 },
  // France · Burgundy - Grand Cru · Jura
  { id: 'r24', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Jura', vintage: '2018', name: 'Domaine Des Murmures', producer: 'Emmanuel Lançon', grapes: 'Poulsard', price: 245 },
  { id: 'r25', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Jura', vintage: '2018', name: 'Arbois Pupillin', producer: 'Renaud Bruyere & Adeline Houillon', grapes: 'Poulsard', price: 185 },
  { id: 'r26', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Jura', vintage: '2017', name: 'Vers La Maison Rouge 1.5L', producer: 'Jean Yves Péron', grapes: 'Mondeuse & Gamay', price: 205 },
  { id: 'r27', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Jura', vintage: 'NV', name: 'VDF Les Rouliers', producer: 'Henri Bonneau', grapes: 'Grenache', price: 145 },
  // France · Burgundy - Grand Cru · Bordeaux
  { id: 'r28', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Bordeaux', vintage: '2017', name: 'Château La Mission Haut Brion Cru Classé', producer: 'Château La Mission Haut Brion Cru Classé', grapes: 'Cabernet Franc, Cabernet Sauvignon, Merlot', price: 635, featured: true },
  { id: 'r29', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Bordeaux', vintage: '2006', name: 'Graves', producer: 'Château Pape Clément', grapes: 'Merlot, Cabernet Sauvignon', price: 275 },
  { id: 'r30', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Bordeaux', vintage: '2012', name: 'Château Pontet-Canet', producer: 'Château Pontet-Canet', grapes: 'Merlot, Cabernet Sauvignon', price: 325 },
  { id: 'r31', category: 'red', country: 'France', region: 'Burgundy - Grand Cru', subregion: 'Bordeaux', vintage: '2012', name: 'Château Palmer', producer: 'Château Palmer', grapes: 'Merlot, Cabernet Sauvignon', price: 665 },
  // Italy · Toscana
  { id: 'r32', category: 'red', country: 'Italy', region: 'Toscana', vintage: '2019', name: 'Sassicaia', producer: 'Tenuta San Guido', grapes: 'Cabernet Franc, Cabernet Sauvignon', price: 605, featured: true },
  { id: 'r33', category: 'red', country: 'Italy', region: 'Toscana', vintage: '2018', name: 'Brunello di Montalcino', producer: 'Poggio di Sotto', grapes: 'Sangiovese', price: 395 },
  { id: 'r34', category: 'red', country: 'Italy', region: 'Toscana', vintage: '2012', name: 'Brunello di Montalcino', producer: 'Salvioni', grapes: 'Sangiovese', price: 370 },
  { id: 'r35', category: 'red', country: 'Italy', region: 'Toscana', vintage: '2015', name: 'Tignanello', producer: 'Antinori', grapes: 'Sangiovese, Cabernet Sauvignon, Cabernet Franc', price: 585 },
  { id: 'r36', category: 'red', country: 'Italy', region: 'Toscana', vintage: '2007', name: 'Tignanello', producer: 'Antinori', grapes: 'Sangiovese, Cabernet Sauvignon, Cabernet Franc', price: 505 },
  // Italy · Toscana · Piemonte
  { id: 'r37', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2019', name: 'La Tartufaia', producer: 'Giulia Negri', grapes: 'Nebbiolo', price: 135 },
  { id: 'r38', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2013', name: 'Bricco Luciani', producer: 'Cascina del Monastero', grapes: 'Nebbiolo', price: 120 },
  { id: 'r39', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2017', name: 'Pira', producer: 'Roagna', grapes: 'Nebbiolo', price: 420 },
  { id: 'r40', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2021', name: 'Barbera Vigna Francia', producer: 'Giacomo Conterno', grapes: 'Barbera D´Alba', price: 160 },
  { id: 'r41', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2018', name: 'Barolo Francia', producer: 'Giacomo Conterno', grapes: 'Nebbiolo', price: 450, featured: true },
  { id: 'r42', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2017', name: 'Barolo Francia', producer: 'Giacomo Conterno', grapes: 'Nebbiolo', price: 535, featured: true },
  { id: 'r43', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2015', name: 'Barolo Francia', producer: 'Giacomo Conterno', grapes: 'Nebbiolo', price: 495, featured: true },
  { id: 'r44', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2012', name: 'Barolo Falletto', producer: 'Bruno Giacosa', grapes: 'Nebbiolo', price: 415 },
  { id: 'r45', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2014', name: 'Barolo Falletto', producer: 'Bruno Giacosa', grapes: 'Nebbiolo', price: 355 },
  { id: 'r46', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2016', name: 'Sassella Nuova Riserva', producer: 'Arpepe', grapes: 'Nebbiolo', price: 175 },
  { id: 'r47', category: 'red', country: 'Italy', region: 'Toscana', subregion: 'Piemonte', vintage: '2019', name: 'Grumello Sant’Antonio Riserva', producer: 'Arpepe', grapes: 'Nebbiolo', price: 120 },
  // Spain · 
  { id: 'r48', category: 'red', country: 'Spain', region: '', vintage: '2020', name: 'Arbossar', producer: 'Terroir al Limit', grapes: 'Carignan', price: 155 },
  { id: 'r49', category: 'red', country: 'Spain', region: '', vintage: '2020', name: 'San Quiles', producer: 'Bodegas Altun', grapes: 'U', price: 100 },
  { id: 'r50', category: 'red', country: 'Spain', region: '', vintage: '2012', name: 'Viña Tondonia', producer: 'Bodegas Lopez de Heredia', grapes: 'Tempranillo, Garnacha, Graciano, Mazuelo', price: 135 },
  { id: 'r51', category: 'red', country: 'Spain', region: '', vintage: '2001', name: 'Viña Tondonia', producer: 'Bodegas Lopez de Heredia', grapes: 'Tempranillo, Garnacha, Graciano, Mazuelo', price: 305 },
  { id: 'r52', category: 'red', country: 'Spain', region: '', vintage: '2023', name: 'Kalamity', producer: 'Oxer', grapes: 'Tempranillo, Garnacha, Garnacha Blanca, Viura', price: 285 },
  { id: 'r53', category: 'red', country: 'Spain', region: '', vintage: '2023', name: 'Suzanne', producer: 'Oxer', grapes: 'Garnacha', price: 165 },
  // Spain · Ribera del Duero
  { id: 'r54', category: 'red', country: 'Spain', region: 'Ribera del Duero', vintage: '2012', name: 'Unico', producer: 'Bodegas Vega Sicilia', grapes: 'Tempranillo, Cabernet Sauvignon', price: 725, featured: true },
  { id: 'r55', category: 'red', country: 'Spain', region: 'Ribera del Duero', vintage: '2020', name: 'Cobrana', producer: 'Veronica Ortega', grapes: 'Mencia', price: 120 },
]
