<?php

namespace Tests\Unit\Repositories;

use App\Models\Category;

use Tests\TestCase;

use \stdClass;

use Faker\Factory as Faker;

use App\Repositories\RoomCategory\RoomCategoryRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoomCategoryTest extends TestCase
{
    protected $category;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $this->category = [
            'name' => $this->faker->word,
            'price' => rand(101, 900),
            'description' => 'test data',
        ];
        $this->category_repository = new RoomCategoryRepository();
    }

    public function test_all() {
        $all_categories = $this->category_repository->all();
        $this->assertDatabaseCount('categories', count($all_categories));
    }

    public function test_store() {
        $category = $this->category_repository->store($this->category);
        $this->assertInstanceOf(Category::class, $category);
        $this->assertDatabaseHas('categories', $this->category);
    }

    public function test_show() {
        $category = Category::factory()->create(['description' => 'test data']);
        $found_category = $this->category_repository->show($category->id);
        $this->assertInstanceOf(Category::class, $found_category);
        $this->assertEquals($found_category->name, $category->name);
        $this->assertEquals($found_category->price, $category->price);
        $this->assertEquals($found_category->description, $category->description);
    }

    public function test_update() {
        $category = Category::factory()->create(['description' => 'test data']);
        $new_category = $this->category_repository->update($this->category, $category->id);
        $this->assertInstanceOf(Category::class, $new_category);
        $this->assertEquals($new_category->name, $this->category['name']);
        $this->assertEquals($new_category->price, $this->category['price']);
        $this->assertEquals($new_category->description, $this->category['description']);
        //Test if the database is updated
        $this->assertDatabaseHas('categories', $this->category);
    }

    public function test_delete() {
        $category = Category::factory()->create(['description' => 'test data']);
        $delete_category = $this->category_repository->delete($category->id);
        $this->assertTrue($delete_category);
        $this->assertDatabaseMissing('categories', $category->toArray());
    }

    public function tearDown() : void
    {
        Category::where('description', 'test data')->delete();
        parent::tearDown();
    }
}
