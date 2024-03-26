<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Category;
use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class ProductController extends AbstractController
{
    #[Route('/', name: 'product')]
    public function index(): Response
    {
        return $this->render('product/index.html.twig');
    }

    #[Route('/product', name: 'home_product', methods:['GET'])]
    public function home(ProductRepository $productRepository): Response
    {
        return $this->render('product/product.html.twig' , [
            'data' => $productRepository->findAll(), 
            // 'categories' => $categories,
        ]);
    }

    #[Route('/product/show-all', name: 'product_show_all', methods:['GET'])]
    public function showAll(): Response 
    {
        $products = $this->getDoctrine()
                        ->getRepository(Product::class)
                        ->findAll();
        $data= [];
        // dd($products);
        foreach ($products as $product){
            $data[] = [
                'id' => $product->getId(),
                'nom' => $product->getNom(),
                'description' => $product->getDescription(),
                'category' => $product->getCategory(),
                'image' => $product->getImage(),
            ];
        }
        return $this->json($data);
    }

    #[Route('/product/show/{id}', name: 'product_show', methods:['GET'])]
    public function show(int $id): Response
    {
        $product = $this->getDoctrine()
                        ->getRepository(Product::class)
                        ->find($id);
        if (!$product){
            return $this->json('Pas de produit trouvé'. $id, 404);
        }

        $data = [
                'id' => $product->getId(),
                'nom' => $product->getNom(),
                'description' => $product->getDescription(),
                'category' => $product->getCategory(),
                'image' => $product->getImage(),
        ];
        return $this->json($data);
    }

    #[Route('/product/new', name: 'product_new', methods:['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $manager = $this->getDoctrine()->getManager();

        if($request->isMethod('POST')) {
        $product = new Product();
        $product->setNom($request->request->get('nom'));
        $product->setDescription($request->request->get('description'));
        $product->setCategory($manager->getRepository(Category::class)->find($request->request->get('category')));
        

            // Sauvegardez l'image sur le disque
            $image = $request->files->get('image');
            if ($image) {
                $originalFilename = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                $newFilename = $originalFilename. '-' . uniqid() . '.' .$image->guessExtension();
                $image->move(
                    $this->getParameter('images_directory'),
                    $newFilename
                );
                $product->setImage($newFilename);
            }
        
            $manager->persist($product);
            $manager->flush();
        return $this->json('Le produit numeros '.$product->getId().' à été crée');
        }
    }

    #[Route('/product/edit/{id}', name: 'product_edit', methods:['POST'])]
    public function edit(Request $request , int $id): Response
    {
        $manager = $this->getDoctrine()->getManager();
        $product = $manager->getRepository(Product::class)->find($id);
 
        if (!$product) {
            return $this->json('No project found for id' . $id, 404);
        }

        // $product = new Product();
        $product->setNom($request->request->get('nom'));
        $product->setDescription($request->request->get('description'));
        // $product->setCategory($manager->getRepository(Category::class)->find($request->request->get('category')));
        $categoryId = $request->request->get('category');
        $category = $manager->getRepository(Category::class)->findOneBy(['id' => $categoryId]);
        $product->setCategory($category);

        // Sauvegardez l'image sur le disque
        $image = $request->files->get('image');
        if ($image) {
            $originalFilename = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
            $newFilename = $originalFilename. '-' . uniqid() . '.' .$image->guessExtension();
            $image->move(
                $this->getParameter('images_directory'),
                $newFilename
            );
            $product->setImage($newFilename);
        }
        $manager->flush();

        $data = [
            'id' => $product->getId(),
            'nom' => $product->getNom(),
            'description' => $product->getDescription(),
            'category' => $product->getCategory(),
            // ->getName(),
            'image' => $product->getImage(),
        ];
        return $this->json($data);
        
    }

    #[Route('/product/delete/{id}', name: 'product_delete', methods:['DELETE'])]
    public function delete(int $id): Response
    {
        $manager = $this->getDoctrine()->getManager();

        $product = $manager->getRepository(Product::class)->find($id);

        if (!$product){
            return $this->json('Pas de produit trouvé'. $id, 404);
        }
        $manager->remove($product);
        $manager->flush();

        return $this->json('le produit numeros '.$id.' effacé');
    }

    #[Route("/get-categories" , name:"get-categories")]
    public function getCategories() :Response
    {
        // recuperer les categories de la base de données
        $categories = $this->getDoctrine()->getRepository(Category::class)->findAll();
        // var_dump($categories);
        //preparer les dossier
        $data= [];

        foreach($categories as $category) {
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName()
            ];
        }

    return  new JsonResponse($data);
    }
}
