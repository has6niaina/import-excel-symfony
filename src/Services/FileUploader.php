<?php

namespace App\Services;

use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Twig\Environment;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;

class FileUploader
{
    public function __construct(
        private EntityManagerInterface $em,
        private Environment $environment,
        private ParameterBagInterface $parameters
    ) {}

    public function handleImageFormData(FormInterface $ImageForm): JsonResponse
    {
        if ($ImageForm->isValid()) {
            return $this->handleValidForm($ImageForm);
        } else {
            return $this->handleInvalidForm($ImageForm);
        }
    }

    private function handleValidForm(FormInterface $ImageForm) : JsonResponse
    {
        /** @var Image $Image */
        $image = $ImageForm->getData();

        /** @var UploadedFile $uploadedImage */
        $uploadedImage = $ImageForm['image']->getData();

        $newFileName = $this->renameUploadedFile($uploadedImage, $this->parameters->get('images_directory'));
        $image->setImage($newFileName);

        $this->em->persist($image);
        $this->em->flush();

        return new JsonResponse([
            'html' => $this->environment->render('image/image.html.twig', [
                'image' => $image
            ])
        ]);
    }

    private function handleInvalidForm(FormInterface $ImageForm) : JsonResponse
    {
        return new JsonResponse([
            'errors' => $this->getErrorMessages($ImageForm)
        ]);
    }

    private function renameUploadedFile(UploadedFile $uploadedFile, string $directory) : string
    {
        $newFileName = uniqid(more_entropy: true) . ".{$uploadedFile->guessExtension()}";
        $uploadedFile->move($directory, $newFileName);

        return $newFileName;
    }


    private function getErrorMessages(FormInterface $form): array
    {
        $errors = [];

        foreach ($form->getErrors() as $error) {
            $errors[] = $error->getMessage();
        }

        foreach ($form->all() as $child) {
            if (!$child->isValid()) {
                $errors[$child->getName()] = $this->getErrorMessages($child);
            }
        }

        return $errors;
    }
}