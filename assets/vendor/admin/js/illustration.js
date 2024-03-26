
AllImages();

function AllImages(){
    var productId = $('#image_product').val();
        if (productId !== undefined) {
            // Envoie la requête AJAX avec productId
        } else {
            console.error('Erreur: impossible de récupérer l\'ID du produit');
        }
    // var productId = $(this).data('product-id');
    // alert(productId)
    $.ajax({
        url: "/get-images/" + productId,
        method: "GET",
        success: function(response) {
            console.log(response);
            $("#all-image").html("");
            const images =  response;
            for(let i = 0; i < images.length; i++)
            {
                let deleteBtn = '<button' + 
                                    ' class="btn btn-outline-danger sm" ' + 
                                    ' data-id="' + images[i].id + '" ' + 
                                    ' id="deleteIllustrationBtn">Supprimer' +
                                '</button>  ';

                let ImageRow =  '<tr>' + 
                                    '<td>' + images[i].id + '</td>' +
                                    '<td>' + images[i].title + '</td>'+
                                    '<td>' + '<img src="' + "/uploads/thumbnails/" + images[i].image + '" width="45" height="45"/>' + '</td>' +
                                    '<td style="text-align:center;">'+ deleteBtn +'</td>' +
                            '</tr>';
                $("#all-image").append(ImageRow);
            }
        },
        error: function(response) {
            console.log(response.responseJSON)
        }
    });
}
/**
 *
 */
$(document).ready(function (){
    $.uploadPreview({
        input_field: "#illustration",
        preview_box: "#image-preview",
        label_field: "#image-label",
        label_default: "Choisir une image",
        label_selected: "Changer l'image",
        no_label: false // deja par defaut
    });
    
    
    
    $(document).on("click" , "#deleteIllustrationBtn", function(e) {
    e.preventDefault();
    if(window.confirm("Voulez vous effacer cette enregistrement ?")) {
        var deleteProductBtn = $(this).attr("data-id");
        $.ajax({
            url: "/image/" + deleteProductBtn,
            method: "DELETE",
            success: function(response) {
                
                const successHtml = '<div class="alert alert-success" role="alert"> <b>Image supprimé avec sucess</b></div>';
                $("#alert-div").html(successHtml);
                AllImages();
            },
            error: function(response) {
                console.log(response.responseJSON)
            }
        });
    }
});
    // $('#form').on('submit', function (e) {
    //     e.preventDefault()
    //     const formData = new FormData();
    //     formData.append('image[title]', $("#image_title").val());
    //     formData.append('image[product]', $("#image_product").val());
    //     formData.append('image[image]', $('#illustration')[0].files[0]);

    //     const id = $("#image_id").val();
    //     alert(id)
    //     $.ajax({
    //         url: "/image/new" + id,
    //         method: "POST",
    //         data: formData,
    //         processData: false,
    //         contentType: false,
    //         success: function(response) {
    //             console.log(response);
    //             // $("#save-product-btn").prop('disabled', false);
    //             // const successHtml = '<div class="alert alert-success" role="alert"> <b>Product crée avec sucess</b></div>';
    //             // $("#alert-div").html(successHtml);
    //             // AllImages();
    //         },
    //         error: function(response) {
    //             //Gerer les erreurs
    //             console.log(response)
    //             $("#submit_image").prop('disabled', false);
    //             if(typeof response.responseJSON.messages.errors !== 'undefined')
    //             {
    //                 const errors = response.responseJSON.messages.errors;
    //                 var nomValidation = "";
    //                 if(typeof errors.title !== 'undefined')
    //                 {
    //                     nomValidation = '<li>' + errors.title + '</li>';
    //                 }
    
    //                 var errorHtml = '<div class="alert alert-danger" role="alert">' +
    //                                     '<b> Error de Validation </b>' + 
    //                                     '<ul>' + nomValidation  + '</ul>'+
    //                                 '</div>';
    //                 $("#error-div").html(errorHtml);
    //             }
    //         }
    //     });
    //     $("#form")[0].reset();
    // });
});

// $(document).ready(function() {
//     $.ajax({
//       url: '/getId-Product',
//       type: 'GET',
//       success: function(images) {
//         console.log(images)
//         // for (var i = 0; i < images.length; i++) {
//         //   var image = images[i];
//         //   $('#category').append('<option value="' + image.id + '">' + image.name + '</option>');
//         // }
//       } 
//     });
//   });

$(document).ready(function() {
    $('#form').submit(function(event) {
        // Empêche le formulaire d'être soumis normalement
        event.preventDefault();

        // Récupère les données du formulaire
        var formData = new FormData(this);

        // Envoie la requête AJAX
        $.ajax({
            url: '/image/new/' + $('#image_product').val(),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                // Réussite de la requête
                console.log('Image ajoutée avec succes');
                // Rafraîchir la page pour afficher la nouvelle image
                location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Échec de la requête
                console.error('Erreur lors de l\'ajout de l\'image:', errorThrown);
            }
        });
        $("#form")[0].reset();
    });
});
