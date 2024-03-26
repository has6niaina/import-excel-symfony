<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/category')]
class CategoryController extends AbstractController
{
    #[Route('/', name: 'category')]
    public function index(): Response
    {
        return $this->render('category/index.html.twig');
    }

    #[Route('/home', name: 'home_category', methods:['GET'])]
    public function home(CategoryRepository $categoryRepository): Response
    {
        return $this->render('category/category.html.twig' , [
            'data' => $categoryRepository->findAll()
        ]);
    }

    #[Route('/showAllCat', name: 'category_show_all', methods:['GET'])]
    public function showAllCategory(): Response
    {
        $categories = $this->getDoctrine()
                            ->getRepository(Category::class)
                            ->findAll();
        $data= [];
        foreach ($categories as $category){
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName()
            ];
        }
        return $this->json($data);
    }

    #[Route('/show/{id}', name: 'category_show', methods:['GET'])]
    public function show(int $id): Response
    {
        $category = $this->getDoctrine()
                        ->getRepository(Category::class)
                        ->find($id);
        if (!$category){
            return $this->json('Pas de category trouvé'. $id, 404);
        }

        $data = [
                'id' => $category->getId(),
                'name' => $category->getName()
        ];
        return $this->json($data);
    }

    #[Route('/new', name: 'category_new', methods:['POST'])]
    public function new(Request $request): Response
    {
        $manager = $this->getDoctrine()->getManager();
        $category = new Category();
        $category->setName($request->request->get('name'));

        $manager->persist($category);
        $manager->flush();

        return $this->json('Le category numeros '.$category->getId().' à été crée');
    }


    #[Route('/edit/{id}', name: 'category_edit', methods:['POST'])]
    public function edit(Request $request , int $id): Response
    {
        $manager = $this->getDoctrine()->getManager();
        $category = $manager->getRepository(Category::class)->find($id);
 
        if (!$category) {
            return $this->json('No category found for id' . $id, 404);
        }

        $category->setName($request->request->get('name'));
        $manager->flush();

        $data = [
            'id' => $category->getId(),
            'name' => $category->getName(),
        ];
        return $this->json($data);
    }

    #[Route('/delete/{id}', name: 'category_delete', methods:['DELETE'])]
    public function delete(int $id): Response
    {
        $manager = $this->getDoctrine()->getManager();

        $category = $manager->getRepository(Category::class)->find($id);

        if (!$category){
            return $this->json('Pas de cagetegory trouvé'. $id, 404);
        }
        $manager->remove($category);
        $manager->flush();

        return $this->json('le category numeros '.$id.' effacé');
    }
}
