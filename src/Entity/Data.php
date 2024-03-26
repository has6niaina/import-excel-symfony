<?php

namespace App\Entity;

use App\Repository\DataRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DataRepository::class)]
class Data
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $kilometrage = null;

    #[ORM\Column(nullable: true)]
    private ?int $numeroFiche = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getKilometrage(): ?int
    {
        return $this->kilometrage;
    }

    public function setKilometrage(?int $kilometrage): self
    {
        $this->kilometrage = $kilometrage;

        return $this;
    }

    public function getNumeroFiche(): ?int
    {
        return $this->numeroFiche;
    }

    public function setNumeroFiche(?int $numeroFiche): self
    {
        $this->numeroFiche = $numeroFiche;

        return $this;
    }
}
