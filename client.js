<script>
    document.addEventListener('DOMContentLoaded', function(){
      google.script.run.withSuccessHandler(statusUpdate).getStatus()
    });
     
   
    function statusUpdate(statusArray) {
     var statusWeb = document.querySelectorAll('.status');
     for (var i = 0; i < statusWeb.length; i++) {
        if ((statusWeb[i].innerText = statusArray[i][1]) === 'Available') {
           statusWeb[i].classList.add('avail');
           document.querySelectorAll('.request')[i].innerText = 'Check Out';
        } else {
           statusWeb[i].classList.add('out');
           document.querySelectorAll('.card-action')[i].classList.add('hide');
        }
      }
    }


//    $('.btn').click(function() {
//       var barcode = this.id;
//       alert(typeof barcode);
//       
//    });

function openForm(clicked_id) {
  document.getElementById("bg-m").style.display = 'flex';
  document.getElementById("item-barcode").innerText = clicked_id;
}

function closeForm() {
  document.getElementById("bg-m").style.display = 'none';
}



/*
** submit request button actions
** no php at the moment
*/
document.getElementById("sub").addEventListener("click", collectPatron);
    
function collectPatron(){
    
    var barcode = document.getElementById("item-barcode").innerText;
    var netId = document.getElementById("netid").value;
    var patron = document.getElementById("fname").value;
    google.script.run.checkOut(barcode, netId);
    closeForm();
    
    // reload the page with the annoying Apps Script
    window.open("",'_top');
}

</script>

