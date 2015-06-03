
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script>

function requestRooms()
{
	$.ajax({
		url: '<?php echo URL; ?>json/rooms.json',
		dataType: 'json',
	})
	.done(function(data) {
	
		for(i=0; i<data.length; i++){
			//alert(data[i].title);
			var id=data[i].roomID;
			var hP=data[i].hasPassword;
			if(data[i].isFull==0)
				$('#camere').append('<div id="'+ data[i].roomID +'"><h3>' +  data[i].title + '</h3>' + data[i].description + ' <button onclick="requestSuccess(\'' + data[i].roomID + '\', \''+ data[i].hasPassword+ '\')">Alatura-te camerei!</button><br>' + '</div>');	
			else
				$('#camere').append('<div id="'+ data[i].roomID +'"><h3>' +  data[i].title + '</h3>' + data[i].description + ' (Momentan, camera este plina)</div>');	
		}
	})
	.fail(function() {
	alert("Nu s-au obtinut date despre camere.")
})
};

function requestSuccess(roomID, hasPassword)
{
	$.ajax({
		url: '<?php echo URL; ?>json/success.json',
		dataType: 'json',
	})
	.done(function(data) {
		//alert(data.success);
		if(data.success==0)
			alert('Nu va puteti conecta la aceasta camera.');
		else
		{
			if(hasPassword==1)
				{
					var divID='#'.concat(roomID);
					var inputID=roomID.concat('pass');
					$(divID).append('Parola: <input type="text" name="password" id="'+inputID+'"><br><button onclick="sendPassword(\'' + inputID + '\')">Submit</button>');
				}
			else conectareJoc();
		}
	})
	.fail(function() {
	alert("Nu s-au obtinut date despre camere.")
})
};

function sendPassword(inID)
{
	var input = document.getElementById(inID);
    alert(input.value);
    inID=inID.replace('pass','');
    inID=inID.concat('/'.concat(input.value));
    var url='https://www.google.ro/'.concat(inID); //de inlocuit
    alert(url);
	$.ajax({
		url: 'url1/', //de modificat
		dataType: 'json',
	}).done(function(data) {
		alert("click aici".link(data));
	})
	.fail(function() {
	alert("Nu am putut intra in camera de joc.")
})
};

function conectareJoc()
{
    alert('Incercam sa ne conectam');
	$.ajax({
		url: 'link2.json', //de modificat
		dataType: 'json',
	}).done(function(data) {
		alert(data);
	})
	.fail(function() {
	alert("Nu am putut intra in camera de joc.")
})
	
};

requestRooms();

</script>

<section>
<div id="camere" >Pentru a intra intr-un joc, alatura-te uneia din camerele de mai jos!</div>
<div id="success"></div>
</section>