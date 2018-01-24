app.controller('getDataCtrl', ['$scope','ajaxService','$rootScope','$localStorage', function ($scope, ajaxService,$rootScope,$localStorage) {

    
    var equipments = [];
    var descriptions = [];
    var manufacturers = [];
    //var data = { 'jobId': '1000' };
    var data = {  };
    var getEquipmentssurl = 'http://10.10.10.75:64419/api/icontrol/gettorquetools';
    //ajax service call for page load
    $rootScope.showTableLoad=false;
    $rootScope.showTableLoadspinner=true;

    ajaxService.getReq(getEquipmentssurl,data)
               .then(function(values){
                console.log(values.data);
                $rootScope.showTableLoadspinner=false;
                $scope.rowCollection = values.data;
                $rootScope.showTableLoad=true;
               // $scope.status = values.data[0];
                console.log(values[0]);
        });
    
    $('#scanned_codes').focus(function(){
                              var that = this;
                              
                                setTimeout(function(){ that.selectionStart = that.selectionEnd = 10000; }, 0);


                            });
    //bar code scanning to take as one input
    var barcode="";
    $(document).keydown(function(e) {

        var code = (e.keyCode ? e.keyCode : e.which);
        if(code==13)// Enter key hit
        {
            $('#scanned_codes').val($('#scanned_codes').val() + '#');
        }
        else if(code==9)// Tab key hit
        {
            //alert(barcode);
        }
        else
        {
            barcode=barcode+String.fromCharCode(code);
        }
       // alert(barcode);
    });
//logic to scan multiple codes 
  $scope.createbatchFromCodes=function(){
        if($rootScope.TransferTo!=null)
        {
            var codes=$('#scanned_codes').val();
           // alert(codes);
            if(codes=="")
            {
                $.alert({
                        title: 'Error!',
                        content: 'Kindly scan atleast one equipment',
                    });
                return false;

            }
           // alert(codes.replace(/##/g,'#'));
            var Keys = codes.split("#"); // ["query=true", "query2=false"]
            for (var k=0; k < Keys.length; k++) {
                console.log("Position "+k+" and length="+Keys[k].length+" element="+Keys[k]);
                if(Keys[k].length==0)
                {
                    Keys.splice(k,1);
                }
            }
           // console.log("Keys Array");
         //   console.log(Keys);
            var uniqueKeys = [];
            var dupKeys=[];
            $.each(Keys, function(i, el){
                if(($.inArray(el, uniqueKeys) === -1) && el.length!=0){ uniqueKeys.push(el);}
                else{dupKeys.push(el); }
            });
       var KeysLength=parseInt(Keys.length)-1;
       var UniqueKeysLength=parseInt(uniqueKeys.length);
       var stBldr='';
       
       stBldr+="<div>";
       stBldr+='<p><strong>Total equipments scanned </strong><span class="badge">'+KeysLength+'</span></p>';

       stBldr+="</div>";
       stBldr+="<div>"
       stBldr+='&nbsp;&nbsp;&nbsp<a href="#" data-toggle="collapse" data-target="#details"><strong> Unique equipments scanned </strong><span class="badge">'+UniqueKeysLength+'</span></a>';
       stBldr+="</div>"
       stBldr+="&nbsp;&nbsp;&nbsp<div id='details' class='collapse table'>";
       stBldr+="<table class='table table-hover table-striped'>";
                stBldr+='<tr>';
                                            stBldr+='<th >S.No</th>';
                                            stBldr+='<th>Description</th>';
                
                
                                            
                                            for (var loop=0; loop < uniqueKeys.length; loop++) 
                                            {
                                                var ucount=loop+1;
                                                                                        if(uniqueKeys[loop].length>0)
                                                                                        {

                                                                                                angular.forEach($scope.rowCollection, function(item){

                                                                                                if(item["KeyID"]==uniqueKeys[loop])
                                                                                                {
                                                                                                    stBldr+='<tr>';
                                                                                                    stBldr+='<td >'+ucount+'</td>';
                                                                                                    stBldr+='<td>'+item["Description"]+'</td>';
                                                                                                    stBldr+='</tr>';
                                                                                                    
                                                                                                }

                                                                                            });

                                                                                        }
                                            }
                
       stBldr+="</table>";    
       stBldr+="</div>";
       stBldr+="<div>";
       stBldr+='&nbsp;&nbsp;&nbsp<a href="#" data-toggle="collapse" data-target="#details_dups"><strong>Duplicate equipments scanned </strong><span class="badge">'+parseInt(KeysLength-UniqueKeysLength)+'</span></a>';
       stBldr+="</div>";
       stBldr+="&nbsp;&nbsp;&nbsp<div id='details_dups' class='collapse table'>";
       stBldr+="<table class='table table-hover table-striped'>";
                stBldr+='<tr>';
                                            stBldr+='<th >S.No</th>';
                                            stBldr+='<th>Description</th>';
                
                
                                            
                                            for (var loop_dup=0; loop_dup < dupKeys.length; loop_dup++) 
                                            {
                                                var ucount=loop_dup+1;
                                                                                        if(dupKeys[loop_dup].length>0)
                                                                                        {

                                                                                                angular.forEach($scope.rowCollection, function(item){

                                                                                                if(item["KeyID"]==dupKeys[loop_dup])
                                                                                                {
                                                                                                    stBldr+='<tr>';
                                                                                                    stBldr+='<td >'+ucount+'</td>';
                                                                                                    stBldr+='<td>'+item["Description"]+'</td>';
                                                                                                    stBldr+='</tr>';
                                                                                                    
                                                                                                }

                                                                                            });

                                                                                        }
                                            }
                
       stBldr+="</table>";    
       stBldr+="</div>";
       stBldr+="</br><div>"
       stBldr+='<p><strong>Press Ok select or cancel to scan more</strong></p>';
       stBldr+="</div>"
       
       $.confirm({
                    icon:' fa fa-exclamation fa-2x',
                    title: 'Scan Summary',
                    content: stBldr,
                    type: 'dark',
                    typeAnimated: true,
                    buttons: {
                        ok: {
                            text: 'Ok',
                            btnClass: 'btn-success',
                            action: function(){
                                                // Loop through the params and split the key and the value
                                                        for (var i=0; i < uniqueKeys.length; i++) {
                                                            if(uniqueKeys[i].length>0)
                                                            {

                                                                    angular.forEach($scope.rowCollection, function(item){
                                                                    if(item["KeyID"]==uniqueKeys[i])
                                                                    {
                                                                        item.isSelected=true;
                                                                        $scope.rowSelect(item);
                                                                        
                                                                    }

                                                                });

                                                            }
                                                        }
                                                        $scope.$digest();
                                                        $.alert({
                                                            title: 'Status',
                                                            content: 'Selection successfull. You can now put them in a batch',
                                                        });

                                               }
                                               
                        },
                        Cancel:{
                            text: 'Cancel',
                            btnClass: 'btn-danger',
                            action: function(){
                            }

                        }
                    }
                });
        
        }
        else
        {
            $.confirm({
                                                                            icon:' fa fa-exclamation fa-1x',
                                                                            title: 'Warning',
                                                                            content: 'Please select a destination location',
                                                                            type: 'dark',
                                                                            typeAnimated: true,
                                                                            buttons: {
                                                                                ok: {
                                                                                    text: 'Ok',
                                                                                    btnClass: 'btn-default',
                                                                                    action: function(){
                                                                                        $("html, body").animate({ scrollTop: 0 }, "slow");

                                                                                    }
                                                                                }
                                                                            }
                                                                        });

        }
        

    }


    
 

    
    //for handling downchanged event
    $rootScope.$on('toJobdropboxchanged', function (event, args) {
        $('#scan_row').show();
    });
    $rootScope.$on('toLocationdropboxchanged', function (event, args) {
        //alert('hello');
        $('#scan_row').show();
    });





//for handling flush event
      $rootScope.$on('flushItems', function (event, args) {
        //alert("flush fired");
        angular.forEach($scope.rowCollection, function(item){
            item.isSelected=false;

        });
    });

      $rootScope.$on('resetscope', function (event, args) {
        $scope.$digest();

      });

      //for handling modal close event
      $rootScope.$on('removerow', function (event, args) {
        
        angular.forEach($scope.rowCollection, function(item){
            item.isSelected=false;

        });

       angular.forEach($rootScope.equipmentsSelected,function(item){
        var row=_.findWhere($scope.rowCollection, {SerialNo: item["SerialNo"]});
        row.isSelected=true;
        $scope.$digest();
        
        //deselct all
        if($rootScope.equipmentsSelected.length==0)
        {
            angular.forEach($scope.rowCollection, function(item){
            item.isSelected=false;

        });

        $scope.$digest();

        }

       });

       // console.log("Equipments selected :"+$rootScope.equipmentsSelected);
       
    });

    function syncEquipmentsSelected(item)
    {
        angular.forEach($scope.rowCollection,function(row){
            if(item["SerialNo"]==row["SerialNo"])
            {
                row.isSelected=true;
            }
            else
            {
                row.isSelected=false;
            }

        });

        

    }




                



            var tableLoadFlag =-1;
            $rootScope.equipmentsSelected=[{}];
            $rootScope.equipmentsSelected.splice(0,1);
            var isalreadyadded=-1;
/*            $scope.$watch('displayedCollection', function(row1){
              
              // get selected row
              row1.filter(function(r) {
                //check if in array or not
                isalreadyadded=search(row1,$rootScope.equipmentsSelected)
                if(isalreadyadded>0)
                    console.log("row found at position "+isalreadyadded+1);
                else
                    console.log("row not found");
                 if (r.isSelected & isalreadyadded<0) {

                    var i=-1;
                    console.log("function call for search    :   row "+r.Equipment+" Collection "+$rootScope.equipmentsSelected)
                    i=search(r,$rootScope.equipmentsSelected);
                    console.log(i);
                    //alert(index);
                    if(i<0)
                    {
                        tableLoadFlag =1;
                        $rootScope.equipmentsSelected.push(r);
                        console.log("element added "+r.Equipment);
                        console.log("collection length "+ $rootScope.equipmentsSelected.length)

                    }
                   //console.log(r);
                   

                 }
                 else if (i>0 & tableLoadFlag>0)
                 {
                    
                    var index =-1;
                    if($rootScope.equipmentsSelected)
                    $rootScope.equipmentsSelected.pop();
                    index=search(row1,$rootScope.equipmentsSelected);
                    if(index>0)
                    {
                        $rootScope.equipmentsSelected.splice(index,1);
                    }


                 }
                 else
                 {
                    //alert("doing nothing");
                 }
              })
            }, true);*/
             $rootScope.deleteRowIndex=-1;
            search=function (row){
                //console.log("row"+row);
                //console.log("array length "+myArray.length);
               // console.log("searching row with equipmentId "+row.Equipment);
                //console.log("in collection with length "+$rootScope.equipmentsSelected.length);
                if($rootScope.equipmentsSelected.length==0)
                    return -1;
                else
                {       /*console.log($rootScope.equipmentsSelected.length);
                        var j=0; 
                        for (j=0; j < $rootScope.equipmentsSelected.length; j++;) 
                        {
                            var elemnet=$rootScope.equipmentsSelected[j];
                            console.log("comparing element id "+elemnet.Equipment +" with element id "+row.Equipment);
                                if ($rootScope.equipmentsSelected[j]["Equipment"] === row.Equipment) 
                                {
                                    return j;
                                }
                                else
                                {
                                    return -1;
                                }
                                console.log(j);

                        }*/
                        var searchindex=0;
                        angular.forEach($rootScope.equipmentsSelected, function(item)
                        {

                              if(item.SerialNo == row.SerialNo)
                              {
                                console.log("element found at "+searchindex);
                                $rootScope.deleteRowIndex=searchindex;
                                console.log("set deleterowindex to "+$rootScope.deleteRowIndex);
                                 return searchindex;

                              }
                              searchindex++;
                        });
               }
                
            }
        


tableLoadFlag=0;
function addRow(row)
{
    console.log("adding row with equipment id"+ row.SerialNo);
    $rootScope.equipmentsSelected.push(row);


};

function removeRow()
{
    
        console.log("removing element at position "+$rootScope.deleteRowIndex);
        $rootScope.equipmentsSelected.splice($rootScope.deleteRowIndex,1);



}

$scope.rowSelect =function(row)
{
    if($rootScope.TransferTo!=null)
    {
    //alert('selected row with equipment id '+row.SerialNo);
    //alert($rootScope.TransferTo["Job"]);
    //alert(row["JobID"]);
    if($rootScope.TransferTo["Job"]==row["JobID"] || $rootScope.TransferTo["EMLoc"]==row["JobID"] )
    {
        row.isSelected=false;
        $.confirm({
                    icon:' fa fa-exclamation fa-2x',
                    title: 'Error',
                    content: '<strong>Tool origin and destination are same </br> This tool cannot be selected</strong>',
                    type: 'dark',
                    typeAnimated: true,
                    buttons: {
                        ok: {
                            text: 'Ok',
                            btnClass: 'btn-primary',
                            action: function(){

                            }
                        }
                    }
                });

    }
    else
    {
         if(row.isSelected)
    {
        //alert('selected row with equipment id '+row.Equipment);
        if(row["Locked"]=='false')
        {
            //alert('Locked');
        
        var i=-1;
       // i=search(row);
        if(i<0)
        {
            addRow(row);
        }
        else
        {

        }
     }
     else
     {
        row.isSelected=false;

     }
    }
     else if(!row.isSelected)
    {
        // tableLoadFlag=1;
        console.log("removing row with equipment id "+row.SerialNo);
        
        search(row);

        removeRow();
        
    }

    }

    
   
 }
 else
 {
    //alert('Please select transfer location');
    row.isSelected=false;
    $.confirm({
                    icon:' fa fa-exclamation fa-1x',
                    title: 'Warning',
                    content: 'Please select a destination location',
                    type: 'dark',
                    typeAnimated: true,
                    buttons: {
                        ok: {
                            text: 'Ok',
                            btnClass: 'btn-default',
                            action: function(){
                                $("html, body").animate({ scrollTop: 0 }, "slow");

                            }
                        }
                    }
                });

 }
}






    /*//for no of selected items.Note history is not maintained
    $scope.$watch('displayedCollection', function (newVal) {
        console.log("selected items: " + newVal.filter(function (item) {
            return item.isSelected;
        }).length);
    }, true);*/



    //adding and removing data
    var id = 1;
    function generateRandomItem(id) {

        var equipment = equipments[Math.floor(Math.random() * 3)];
        var description = descriptions[Math.floor(Math.random() * 3)];
        var Manufacturer = manufacturers[Math.floor(Math.random() * 3)];
        

        return {
            id: id,
            Equipment: equipment,
            Description: description,
            Manufacturer: new Date(Manufacturer),
            
        }
    }
    $scope.itemsByPage = 10;
    $scope.rowCollection = [];

    for (id; id < 5; id++) {
        $scope.rowCollection.push(generateRandomItem(id));
    }

    //add to the real data holder
    $scope.addRandomItem = function addRandomItem() {
        $scope.rowCollection.push(generateRandomItem(id));
        id++;
    };

    //remove to the real data holder
    $scope.removeItem = function removeItem(row) {
        var index = $scope.rowCollection.indexOf(row);
        if (index !== -1) {
            $scope.rowCollection.splice(index, 1);
        }
    }

    //for unlock batch event
    $rootScope.$on('BatchUnlocked', function (event, args) {
        //alert("yabadabadoo");
        $rootScope.showTableLoadspinner=true;
        $rootScope.showTableLoad=false;
       /* $.ajax({
                 url: getEquipmentssurl,
                 dataType: 'json',
                 data: JSON.stringify(data),
                 method: 'GET'
               }).done(function (response) 
                    {
 
                      $rootScope.showTableLoadspinner=false;
                      console.log(response[0]);
                      $scope.rowCollection = response;
                      $rootScope.showTableLoad=true;
                            
                                    
                    }).fail(function()
                        {
                                    
                        });*/

        ajaxService.getReq(getEquipmentssurl,data)
               .then(function(values){
                console.log(values.data);
                $rootScope.showTableLoadspinner=false;
                $scope.rowCollection = values.data;
                $rootScope.showTableLoad=true;
               // $scope.$digest();
                
        });
      


    });

    $scope.viewHistory=function(row)
    {
            //alert("hello");
            var data=row.EquipmentID;
            var EphysicalDate='';
            var myObj = { "EquipmentID":row.EquipmentID};
            var myJSON = JSON.stringify(myObj);
            var getEquipmentHistoryURL="http://10.10.10.75:64419/api/icontrol/TrackEquipment";
            ajaxService.postReq(getEquipmentHistoryURL,myJSON)
                                            .then(function(values)
                                            {
                                                var stBldr='';
                                                 if(row.PhysicalDate!=null)
                                                {
                                                    EphysicalDate=row.PhysicalDate.split("T")[0];

                                                }
                                                stBldr+='<div class="container">';
                                                stBldr+='<div class="row">';
                                                
                                                    stBldr+='<div class="col-md-4 col-sm-6">';
                                                        stBldr+='<h4><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;&nbsp;Last Recorded Physical Date</h4>' ;    
                                                          stBldr+='<div class="form-group" style="width:200px">';
                                                                     stBldr+="<div class='input-group date' style='width:200px !important' id='physicaldatepicker'>";
                                                                            stBldr+='<input type="text"  class="name form-control" value="'+EphysicalDate+'"/>';
                                                                            stBldr+='<span class="input-group-addon">';
                                                                                stBldr+="<span class='glyphicon glyphicon-calendar'></span>";

                                                                            stBldr+="</span>";
                                                                     stBldr+="</div>";
                                                            
                                                         stBldr+='</div>';
                                                    stBldr+='</div>';
                                                    stBldr+="<div class='col-md-4 col-sm-6' style='margin-top:43px !important'  >"
                                                            stBldr+="<button class='btn btn-primary btn-sm'  type='button' id='btn_updateDate'>Update Date</button>";
                                                    stBldr+="</div>"
                                                stBldr+='</div>';
                                                stBldr+='<div class="row">';
                                                    stBldr+='<div class="col-md-4">';
                                                            stBldr+='<h4><i class="fa fa-paperclip" aria-hidden="true"></i>&nbsp;&nbsp;Attachment</h4>' ;    
                                                                stBldr+='<div class="form-group" style="width:200px">';
                                                        
                                                                   // stBldr+="<div class='input-group date' style='width:200px !important' id='physicaldatepicker'>";
                                                                        
                                                                    stBldr+='<button class="btn btn-primary btn-sm"  type="button" id="btn_addattachment">Add Attachment</button>';
                                                                stBldr+="</div>";
                                                            
                                                    stBldr+='</div>';
                                                stBldr+='</div>';
                                                //stBldr+='</div>';
                                                //stBldr+='</div></br></br></br></br>';
                                                stBldr+='<div class="row" style="width:600px!important">'
                                                    stBldr+="<div class=' container table-responsive' style='overflow-x:auto !important;'>";
                                                        stBldr+="<h3><i class='fa fa-truck' aria-hidden='true'></i>&nbsp;&nbsp; Previous Transfers</h3>";
                                                        stBldr+="<table class='table table-hover table-striped' >";
                                                        stBldr+="<thead class='thead-inverse'>";
                                                        stBldr+='<tr>';
                                                        stBldr+='<th >#</th>';
                                                        stBldr+='<th>Date In</th>';
                                                        stBldr+='<th >Time In</th>';
                                                        stBldr+='<th>Transferred To</th>';
                                                        stBldr+='<th>Initiated On</th>';
                                                        stBldr+='<th>Initiated By</th>';
                                                        stBldr+='</tr>';
                                                        stBldr+="</thead>";
                                                        stBldr+="<tbody>";
                                                        stBldr+='<tr>';
                                                        var count=1;
                                                        $.each(values.data,function(i,v){
                                                        stBldr+='<tr>';
                                                        if($(v)[0].JobDesc=="" && $(v)[0].LocationDesc!="")
                                                        {
                                                            var TransferedTo= $(v)[0].LocationDesc;

                                                        }
                                                        else if($(v)[0].JobDesc!="" && $(v)[0].LocationDesc=="")
                                                        {
                                                            var TransferedTo= $(v)[0].JobDesc;


                                                        }
                                                        var ETimeIn="";
                                                        var EDateIn="";

                                                        if(($(v)[0].DateIn)!=null)
                                                        {
                                                            EDateIn=$(v)[0].DateIn.split("T",1);
                                                        }
                                                        if(($(v)[0].TimeIn)!=null)
                                                        {
                                                            ETimeIn=$(v)[0].TimeIn.split("T")[1];

                                                        }
                                                        stBldr+='<td>'+count+'</td>'+'<td>'+EDateIn+'</td><td>'+ETimeIn+'</td><td>'+TransferedTo+'</td><td>'+$(v)[0].CreatedDate.split("T",1)+'</td><td>'+$(v)[0].CreatedBy+'</td>';
                                                        stBldr+='</tr>';
                                                        count++;
                                                        });
                                                        stBldr+="</tbody>";
                                                        stBldr+='</table>';
                                                    stBldr+='</div>';
                                                    
                                                stBldr+='</div>';
                                            stBldr+='</div>';
                                                var str=$(stBldr);
                                               // alert(str);
                                                $.dialog({
                                                          
                                                          icon:'glyphicon glyphicon-info-sign',
                                                          title: 'Details for '+row.EquipmentID+': '+row.Description,
                                                          content: str,
                                                         
                                                          columnClass: 'small col-sm-12',
                                                          onContentReady: function () {
                                                                                        var self = this;
                                                                                        $(function () {
                                                                                                            var obj={'vertical':'auto','horizontal':'right'};
                                                                                                            $('#physicaldatepicker').datetimepicker({
                                                                                                                                                      format:'YYYY-MM-DD'
                                                                                                                                                      
                                                                                                                                                     });
                                                                                                            
                                                                                                             $('#btn_updateDate').click(function(){
                                                                                                               // alert(row.EquipmentID+' update with date val '+$('#physicaldatepicker').data('date'));
                                                                                                                var DateTobeUpdated=$('#physicaldatepicker').data('date');
                                                                                                                row.PhysicalDate=DateTobeUpdated;
                                                                                                                var jsonObject=[];
                                                                                                                jsonObject.push(row);
                                                                                                                var postScheduleUrl="http://10.10.10.75:64419/api/icontrol/updatePhysicalDateViewpoint";
                                                                                                                var postdata=JSON.stringify(jsonObject);
                                                                                                                $.dialog({
                                                                                                                                title:'Update Status',
                                                                                                                                icon: 'glyphicon glyphicon-info-sign',
                                                                                                                                closeIcon: true,
                                                                                                                                closeIconClass: 'fa fa-close',
                                                                                                                                type: 'dark',
                                                                                                                                content: function () {
                                                                                                                                    var self = this;
                                                                                                                                    return $.ajax({
                                                                                                                                        url: postScheduleUrl,
                                                                                                                                        dataType: 'json',
                                                                                                                                        data: postdata,
                                                                                                                                        method: 'post'
                                                                                                                                    }).done(function (response) {
                                                                                                                                        if(response=="Success")
                                                                                                                                        {
                                                                                                                                            self.setContent('<strong>PhysicalDate updated successfully</strong>');

                                                                                                                                        }
                                                                                                                                        else
                                                                                                                                        {
                                                                                                                                            self.setContent('<strong>PhysicalDate Update failed</strong>');

                                                                                                                                        }
                                                                                                                                        
                                                                                                                                    }).fail(function(){
                                                                                                                                        self.setContent('Something went wrong.');
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            });

                                                                                                            });
                                                                                                            $('#btn_addattachment').click(function(){
                                                                                                                          $.confirm({
                                                                                                                                        columnClass:'medium',
                                                                                                                                        title: 'Add Attachment',
                                                                                                                                        content: '' +
                                                                                                                                        '<form action="" class="formName">' +
                                                                                                                                        '<div class="form-group">' +
                                                                                                                                        '<label>Description</label>' +
                                                                                                                                       
                                                                                                                                        '<input type="text" placeholder="Your name" class="description form-control" required />' +
                                                                                                                                        
                                                                                                                                        '<label for="fileselector">Choose File</label>'+
                                                                                                                                        '<input type="file" class="form-control-file" accept="image/*" capture="camera" id="fileselector" required>'+
                                                                                                                                        '</div>' +
                                                                                                                                        
                                                                                                                                        '</form>',
                                                                                                                                        buttons: {
                                                                                                                                            formSubmit: {
                                                                                                                                                text: 'Upload',
                                                                                                                                                btnClass: 'btn-blue',
                                                                                                                                                action: function () {
                                                                                                                                                    var description = this.$content.find('.description').val();
                                                                                                                                                    if(!description){
                                                                                                                                                        $.alert('provide a valid description');
                                                                                                                                                        return false;
                                                                                                                                                    }
                                                                                                                                                    //$.alert('Your name is ' + name);
                                                                                                                                                    var uploadedBy=sessionStorage.getItem("UserId");
                                                                                                                                                    var file = document.getElementById("fileselector").files[0];
                                                                                                                                                    if(!file){
                                                                                                                                                        $.alert('please select a file');
                                                                                                                                                        return false;
                                                                                                                                                    }
                                                                                                                                                    //var fileMetaData = [];
                                                                                                                                                    //fileMetaData.push({ 'KeyID': row.KeyID});
                                                                                                                                                    var data = new FormData();
                                                                                                                                                   // var file = $('form input[type=file]')[0].files[0];
                                                                                                                                                    data.append('file',file);
                                                                                                                                                    data.append('KeyID',JSON.stringify(row.KeyID));
                                                                                                                                                    data.append('UploadedBy',uploadedBy);
                                                                                                                                                    data.append('Description',description);
                                                                                                                                                    console.log(data);
                                                                                                                                                    $.dialog({
                                                                                                                                                                title:'Add Attachment',
                                                                                                                                                                icon:'fa fa-paperclip',
                                                                                                                                                                 
                                                                                                                                                                content: function () {
                                                                                                                                                                    var self = this;
                                                                                                                                                                    return $.ajax({
                                                                                                                                                                        url: 'http://10.10.10.75:64419/api/icontrol/Upload',
                                                                                                                                                                         processData: false,
                                                                                                                                                                         contentType: false,
                                                                                                                                                                         data: data,
                                                                                                                                                                         type: 'POST'
                                                                                                                                                                    }).done(function (response) {
                                                                                                                                                                        if(response!="failed")
                                                                                                                                                                        {
                                                                                                                                                                           self.setTheme('light') ;
                                                                                                                                                                           self.setContent('<strong>Attachment successfully attached in Viewpoint for '+row.EquipmentID+" : "+row.Description+'</strong>');

                                                                                                                                                                        }
                                                                                                                                                                        else
                                                                                                                                                                        {
                                                                                                                                                                            self.setTheme('dark') ;
                                                                                                                                                                           self.setContent('<strong>Failed to attach in Viewpoint for '+row.EquipmentID+" : "+row.Description+'</strong>'); 
                                                                                                                                                                        }
                                                                                                                                                                        
                                                                                                                                                                        
                                                                                                                                                                    }).fail(function(){
                                                                                                                                                                        self.setTheme('dark') ;
                                                                                                                                                                        self.setContent('<strong>Something went wrong.Kindly contact the administrator.</strong>');
                                                                                                                                                                    });
                                                                                                                                                                }
                                                                                                                                                            });
                                                                                                                                                    
        
                                                                                                                                            }
                                                                                                                                        },
                                                                                                                                            cancel: function () {
                                                                                                                                                //close
                                                                                                                                            },
                                                                                                                                        },
                                                                                                                                        onContentReady: function () {
                                                                                                                                            // bind to events
                                                                                                                                            var jc = this;
                                                                                                                                            this.$content.find('form').on('submit', function (e) {
                                                                                                                                                // if the user submits the form by pressing enter in the field.
                                                                                                                                                e.preventDefault();
                                                                                                                                                jc.$$formSubmit.trigger('click'); // reference the button and click it
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                    })
                                                                                                                                                                                                                                                });

                                                                                                      });


                                                                                        
                                                                                       
                                                                                        
                                                                                      },
                                                          type: 'dark',
                                                          typeAnimated: true,
                                                          buttons: {
                                                              Continue: {
                                                                  text: 'Back',
                                                                  btnClass: 'btn-primary',
                                                                  action: function(){
                                                                        //$window.location.reload();
                                                                  }
                                                              }
                                                          }
                                                });
        //alert(item.EquipmentID);
                                            })
  
}
$scope.viewAttachedEquipments=function(row)
{
    //alert(row);
    var stBldr='';
                                                stBldr+="<div class='table-responsive'>";
                                                stBldr+="<table class='table table-reflow'>";
                                                stBldr+="<thead class='thead-inverse'>";
                                                stBldr+='<tr>';
                                                stBldr+='<th>#</th>';
                                                stBldr+='<th>Attached ToolID</th>';
                                                stBldr+='<th>Attached Tool Desc</th>';
                                                stBldr+='</tr>';
                                                stBldr+="</thead>";
                                                stBldr+="<tbody>";
                                                
                                                var equipmentList=row["AttachmentList"].split('#');
                                                var equipmentListDesc=row["AttachmentDesc"].split('$');
                                                var count=1;
                                                for(i=0;i<equipmentList.length;i++)
                                                {
                                                    stBldr+='<tr>';
                                                    stBldr+='<td>'+count+'</td>'+'<td>'+equipmentList[i]+'</td><td>'+equipmentListDesc[i]+'</td>';
                                                    stBldr+='</tr>';
                                                    count++;


                                                }
                                                stBldr+="</tbody>";
                                                stBldr+='</table>';
                                                stBldr+='</div>';
                                                var str=$(stBldr);
                                                $.confirm({
                                                          icon:'glyphicon glyphicon-info-sign',
                                                          title: 'Attached Tools for '+row.EquipmentID+': '+row.Description,
                                                          content: str,
                                                          containerFluid:true,
                                                          type: 'dark',
                                                          typeAnimated: true,
                                                          buttons: {
                                                              Continue: {
                                                                  text: 'Ok',
                                                                  btnClass: 'btn-primary',
                                                                  action: function(){
                                                                        //$window.location.reload();
                                                                  }
                                                              }
                                                          }
                                                });




}




}]);


