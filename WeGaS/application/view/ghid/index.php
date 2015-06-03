<section>
<h1 align="center">Ghid de utilizare WeGaS</h1>

<h2>INTRODUCERE</h2>

	In cazul de fata, daca cititi acest ghid inseamna ca sunteti interesati de serviciile noastre (celor de la TrioGates) si consultati acest ghid pentru a va clarifica eventualele nelamuri.

<h2>RAPORT DE ACTIVITATE</h2>
<a href="<?php echo URL; ?>Raport-al-Proiectului-WEGAS.doc">Raport</a>

<h2>FOLOSIREA SITE-ULUI</h2>

	<p>Navigarea pe site poate sa fie usoara, insa nu puteti avea acces la toate serviciile noastre, inclusiv la participarea la joc, daca nu navigati pe baza unui cont.</p>
	
	<p>Pagina noastra principala include un buton (&quot;JOACA ACUM!&quot;) care sa va trimita direct catre pagina de logare, contine o scurta introducere in tematica jocului, si expune o galerie media care sa formeze o prima impresie despre joc.</p>
	
	 <img src="<?php echo URL; ?>public/img/Pagina-Principala.jpg" alt="Pagina-Principala" width="450">
	
	<p>Asociate site-ului, sunt link-uri pentru diverse utilitati, cum ar fi: logarea si inregistrarea cu un cont, o pagina de intrebari frecvente cu privire la produsul nostru, un Wiki care sa informeze despre atributiile fiecarui element din joc, si o pagina de contact prin care puteti contacta dezvoltatorii jocului.</p>
	
	<img src="<?php echo URL; ?>public/img/Meniu-Principal.jpg" alt="Meniu-Principal" width="450">

<h2>LOGAREA SI FUNCTIONALITATILE EI</h2>

	<p>Dupa inregistrarea utilizatorului, acesta va putea sa se logheze oricand doreste. Logarea va afisa un meniu optional, care va informa utilizatorul de optiunile pe care le detine: cautare de camere de joc, editarea profilului si functia de Log Out.</p>
	
	<img src="<?php echo URL; ?>public/img/Pagina-Optionala.jpg" alt="Pagina-Optionala" width="450">
	
	<p>Pentru participarea la un joc, se va selecta link-ul &quot;Cauta Camere&quot;, unde utilizatorul va fi redirectat catre o pagina numita &quot;Game Room&quot;, din care va putea selecta dintr-o lista, 'camera de joaca'. Acestea reprezinta partide in care un jucator se poate confrunta cu altul. Fiecare &quot;Game Room&quot; va avea un nume si va fi specificat numarul de gameri care folosesc camera respectiva (nu se va putea face nici o conexiune daca camera este plina). De asemena va fi afisata si o scurta descriere a room-ului. Userul va da click pe un item din aceasta lista pentru a intra intr-o partida. De aici, user-ul va fi redirectionat catre o pagina de unde porneste jocul.</p>

<h2>GAMEPLAY-UL</h2>

	<p>Actiunea se desfasoara pe o harta 2D, permitand doi gameri in retea. Aceasta include o interfata si niste unitati.</p>
	
	<p>Scopul jocului consta in a lupta, castigatorul fiind decis dupa numarul de unitati ramase. Daca vor ramane 0 unitati, atunci jucatorul va pierde iar adversarul lui va castiga.</p>
	
	<p>Fiecare entitate din joc va fi reprezentata de un grid (patratel). Doua entitati nu vor putea exista in acelasi grid, contrariul petrecandu-se doar in conditia in care acestea sunt in miscare.</p>
	
	<img src="<?php echo URL; ?>public/img/second.png" alt="Joc" width="450">
	
	<p>Jucatorul poate sa interactioneze cu unul sau mai multe entitati. La comanda unui click pe grid, utilizatorului i se va afisa comenzile specifice unitatii. Dupa apasarea comenzii si a unei portiuni de pe harta, acel grid va fi considerat ca target. Exemple de comenzi sunt: gather, attack, move, etc.</p>
	
	<p>Vor fi trei tipuri de entitati reprezentate printr-o culoare specifica: entitate resource, entitate gatherer, si entitate soldier.</p>
	
	<p>O lupta va fi reprezentata de o camera. Fiecare camera va permite doi jucatori. Un utilizator va putea sa se alature unei camere sau sa creeze una, devenind master si avand dreptul sa dea start jocului. In orice lupta, gamerii vor fi impartiti in pozitii opuse pe harta.</p>

</section>