<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script>

function requestRooms()
{
	$.ajax({
		url: 'rooms.json',
		dataType: 'json',
	})
	.done(function(data) {
		for(i=0; i<data.length; i++){
			//alert(data[i].title);
			$('#camere').append('<div><h3>' +  data[i].title + '</h3>' + data[i].description + ' <button onclick="requestSuccess()">Alatura-te camerei!</button><br>' + '</div>');	
		}
	})
	.fail(function() {
	alert("Nu s-au obtinut date despre camere.")
})
};

function requestSuccess()
{
	$.ajax({
		url: 'success.json',
		dataType: 'json',
	})
	.done(function(data) {
		$('#success').append('<div>' + data.success + '</div>');	
	})
	.fail(function() {
	alert("Nu s-au obtinut cheia de succes.")
})
};


requestRooms();
requestSuccess();

</script>